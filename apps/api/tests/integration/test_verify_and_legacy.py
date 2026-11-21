import json
import uuid
from pathlib import Path

import pytest
from sqlalchemy import text
from sqlalchemy.orm import Session, sessionmaker

from certinova_api.worker.render import RenderBatchTask
from tests.integration.conftest import Harness, World
from tests.integration.data import make_batch, scalar

pytestmark = pytest.mark.integration

LEGACY = json.loads((Path(__file__).parents[1] / "fixtures" / "legacy_blob.json").read_text())


def test_verify_preview_url(
    harness: Harness, world: World, sessions: sessionmaker[Session]
) -> None:
    batch_id, (certificate_id,) = make_batch(sessions, world, [("Aarav Sharma", None, None)])
    job_id = harness.ok("start_batch_render", {"batch_id": str(batch_id)}, world.member)["job_id"]
    RenderBatchTask(harness.worker).run(uuid.UUID(job_id))
    data = {"certificate_id": str(certificate_id)}

    preview = harness.ok("get_verify_preview_url", data)
    assert preview["url"].startswith(f"https://storage.test/certificates/{world.org_id}/")
    assert harness.ok("get_verify_preview_url", {"certificate_id": str(uuid.uuid4())}) is None

    with sessions.begin() as s:
        s.execute(
            text("update public.organizations set show_name_on_verify = false where id = :o"),
            {"o": world.org_id},
        )
    assert harness.ok("get_verify_preview_url", data) is None


def test_unlock_legacy_data(
    harness: Harness, world: World, sessions: sessionmaker[Session]
) -> None:
    first, second = (uuid.UUID(LEGACY["recipients"][i]["uuid"]) for i in (0, 1))
    batch_id, _ = make_batch(sessions, world, [])
    with sessions.begin() as s:
        for certificate_id in (first, second):
            s.execute(
                text(
                    "insert into public.certificates (id, org_id, batch_id) "
                    "values (:id, :org, :batch)"
                ),
                {"id": certificate_id, "org": world.org_id, "batch": batch_id},
            )
        blob = LEGACY["blob"]
        s.execute(
            text(
                "insert into legacy.encrypted_batches (batch_id, encrypted_data, salt, iv) "
                "values (:batch, :data, :salt, :iv)"
            ),
            {
                "batch": batch_id,
                "data": blob["encryptedData"],
                "salt": blob["salt"],
                "iv": blob["iv"],
            },
        )
    data = {"org_id": str(world.org_id), "password": LEGACY["password"]}

    assert harness.error_code("unlock_legacy_data", data, world.admin) == "forbidden"
    assert (
        harness.error_code("unlock_legacy_data", {**data, "password": "wrong"}, world.owner)
        == "wrong-password"
    )
    assert harness.ok("unlock_legacy_data", data, world.owner) == {
        "unlocked_batches": 1,
        "unlocked_certificates": 3,
    }

    with sessions() as s:
        rows = s.execute(
            text(
                "select id, recipient_name, recipient_email, rank from public.certificates "
                "where batch_id = :b order by recipient_name"
            ),
            {"b": batch_id},
        ).all()
    assert [(r.recipient_name, r.recipient_email, r.rank) for r in rows] == [
        ("Aarav Sharma", "aarav@example.com", "1st"),
        ("Diya Patel", "diya@example.com", None),
        ("Kabir Rao", None, None),
    ]
    assert rows[0].id == first
    assert (
        scalar(
            sessions,
            "select encrypted_data is null and unlocked_at is not null "
            "from legacy.encrypted_batches where batch_id = :b",
            b=batch_id,
        )
        is True
    )
    assert harness.error_code("unlock_legacy_data", data, world.owner) == "nothing-to-unlock"
