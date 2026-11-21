import uuid
from collections.abc import Sequence

from sqlalchemy import text
from sqlalchemy.orm import Session, sessionmaker

from tests.integration.conftest import World

Recipient = tuple[str | None, str | None, str | None]


def make_batch(
    sessions: sessionmaker[Session], world: World, recipients: Sequence[Recipient]
) -> tuple[uuid.UUID, list[uuid.UUID]]:
    """A draft batch, as the app creates it through Hasura."""
    batch_id = uuid.uuid4()
    certificate_ids = [uuid.uuid4() for _ in recipients]
    with sessions.begin() as s:
        s.execute(
            text(
                "insert into public.batches (id, org_id, event_id, template_id, created_by) "
                "values (:id, :org, :event, :template, :member)"
            ),
            {
                "id": batch_id,
                "org": world.org_id,
                "event": world.event_id,
                "template": world.template_id,
                "member": world.member,
            },
        )
        for certificate_id, (name, email, rank) in zip(certificate_ids, recipients, strict=True):
            s.execute(
                text(
                    "insert into public.certificates "
                    "(id, org_id, batch_id, recipient_name, recipient_email, rank) "
                    "values (:id, :org, :batch, :name, :email, :rank)"
                ),
                {
                    "id": certificate_id,
                    "org": world.org_id,
                    "batch": batch_id,
                    "name": name,
                    "email": email,
                    "rank": rank,
                },
            )
    return batch_id, certificate_ids


def scalar(sessions: sessionmaker[Session], sql: str, **params: object) -> object:
    with sessions() as s:
        return s.execute(text(sql), params).scalar()
