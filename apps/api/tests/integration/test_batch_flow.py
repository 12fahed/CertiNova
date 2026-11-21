import io
import uuid
import zipfile

import pytest
from sqlalchemy import text
from sqlalchemy.orm import Session, sessionmaker

from certinova_api.worker.email import SendBatchEmailsTask
from certinova_api.worker.export import ExportBatchTask
from certinova_api.worker.render import RenderBatchTask
from tests.images import dark_pixels, open_png
from tests.integration.conftest import Harness, World
from tests.integration.data import Recipient, make_batch, scalar

pytestmark = pytest.mark.integration

RECIPIENTS: list[Recipient] = [
    ("Aarav Sharma", "aarav@example.com", "1st"),
    ("Diya Patel", None, None),
]


def render(
    harness: Harness,
    world: World,
    sessions: sessionmaker[Session],
    recipients: list[Recipient] = RECIPIENTS,
) -> tuple[uuid.UUID, list[uuid.UUID]]:
    batch_id, certificate_ids = make_batch(sessions, world, recipients)
    job_id = harness.ok("start_batch_render", {"batch_id": str(batch_id)}, world.member)["job_id"]
    assert harness.queue.enqueued == [("render_batch", uuid.UUID(job_id))]
    RenderBatchTask(harness.worker).run(uuid.UUID(job_id))
    return batch_id, certificate_ids


def test_render_flow(harness: Harness, world: World, sessions: sessionmaker[Session]) -> None:
    batch_id, certificate_ids = render(harness, world, sessions)

    assert (
        scalar(sessions, "select status::text from public.batches where id = :id", id=batch_id)
        == "ready"
    )
    job = (
        sessions()
        .execute(
            text(
                "select status::text, progress, total, result from public.jobs where ref_id = :id"
            ),
            {"id": batch_id},
        )
        .one()
    )
    assert (job.status, job.progress, job.total) == ("done", 2, 2)
    assert job.result == {"rendered": 2, "failed": 0}
    snapshot = scalar(
        sessions, "select template_snapshot from public.batches where id = :id", id=batch_id
    )
    assert snapshot["organisation_name"] == "IT Org"  # type: ignore[index]

    image = open_png(
        harness.storage.download(
            "certificates", f"{world.org_id}/{batch_id}/{certificate_ids[0]}.png"
        )
    )
    assert dark_pixels(image, (100, 100, 700, 200)) > 100
    assert dark_pixels(image, (600, 400, 750, 550)) > 1000


def test_render_refuses_twice_empty_and_outsiders(
    harness: Harness, world: World, sessions: sessionmaker[Session]
) -> None:
    batch_id, _ = make_batch(sessions, world, RECIPIENTS)
    empty_batch, _ = make_batch(sessions, world, [])

    assert (
        harness.error_code("start_batch_render", {"batch_id": str(batch_id)}, world.outsider)
        == "forbidden"
    )
    assert (
        harness.error_code("start_batch_render", {"batch_id": str(empty_batch)}, world.member)
        == "batch-empty"
    )
    harness.ok("start_batch_render", {"batch_id": str(batch_id)}, world.member)
    assert (
        harness.error_code("start_batch_render", {"batch_id": str(batch_id)}, world.member)
        == "batch-not-draft"
    )


@pytest.mark.parametrize(
    ("fmt", "expected_files"),
    [
        ("images_zip", ["Aarav Sharma.png", "Diya Patel.png"]),
        ("individual_pdfs", ["Aarav Sharma.pdf", "Diya Patel.pdf"]),
    ],
)
def test_export_flow(
    harness: Harness,
    world: World,
    sessions: sessionmaker[Session],
    fmt: str,
    expected_files: list[str],
) -> None:
    batch_id, _ = render(harness, world, sessions)

    job_id = harness.ok("export_batch", {"batch_id": str(batch_id), "format": fmt}, world.member)[
        "job_id"
    ]
    assert (
        harness.error_code("get_export_url", {"job_id": job_id}, world.member) == "export-not-ready"
    )
    ExportBatchTask(harness.worker).run(uuid.UUID(job_id))

    url = harness.ok("get_export_url", {"job_id": job_id}, world.member)["url"]
    assert url.startswith(f"https://storage.test/exports/{world.org_id}/{job_id}.zip")
    archive = zipfile.ZipFile(
        io.BytesIO(harness.storage.download("exports", f"{world.org_id}/{job_id}.zip"))
    )
    assert sorted(archive.namelist()) == expected_files
    assert harness.error_code("get_export_url", {"job_id": job_id}, world.outsider) == "forbidden"


def test_email_flow(harness: Harness, world: World, sessions: sessionmaker[Session]) -> None:
    bounce: Recipient = ("Ira Bose", "ira@bounce.example.com", None)
    batch_id, _ = render(harness, world, sessions, [*RECIPIENTS, bounce])
    harness.mailer.fail_for.add("ira@bounce.example.com")
    data = {"batch_id": str(batch_id)}

    assert harness.error_code("send_batch_emails", data, world.member) == "forbidden"
    with sessions.begin() as s:
        s.execute(
            text(
                "insert into public.feature_flags (key, org_id, enabled) "
                "values ('email-certificates', :o, true)"
            ),
            {"o": world.org_id},
        )

    job_id = harness.ok("send_batch_emails", data, world.member)["job_id"]
    SendBatchEmailsTask(harness.worker).run(uuid.UUID(job_id))

    assert [m["To"] for m in harness.mailer.sent] == ["aarav@example.com"]
    attachment = next(harness.mailer.sent[0].iter_attachments())
    assert attachment.get_filename() == "Aarav Sharma.png"
    with sessions() as s:
        rows = s.execute(
            text("select email::text, status::text from public.email_deliveries where org_id = :o"),
            {"o": world.org_id},
        ).all()
    deliveries: dict[str, str] = {email: status for email, status in rows}
    assert deliveries == {"aarav@example.com": "sent", "ira@bounce.example.com": "failed"}

    harness.mailer.fail_for.clear()
    retry_job = harness.ok("send_batch_emails", data, world.member)["job_id"]
    SendBatchEmailsTask(harness.worker).run(uuid.UUID(retry_job))
    assert [m["To"] for m in harness.mailer.sent] == ["aarav@example.com", "ira@bounce.example.com"]
    assert harness.error_code("send_batch_emails", data, world.member) == "nothing-to-send"
