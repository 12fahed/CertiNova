import re
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime

from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from certinova_api.db.models import Batches, Certificates, EncryptedBatches, RenderStatus
from certinova_api.hasura.errors import invalid
from certinova_api.hasura.registry import ActionContext, ActionResult, RegisteredAction, action
from certinova_api.services import audit
from certinova_api.services.access import OWNERS, require_org_role
from certinova_api.services.legacy_crypto import (
    LegacyDecryptError,
    LegacyRecipient,
    decrypt_recipients,
)

EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class UnlockLegacyDataInput(BaseModel):
    org_id: uuid.UUID
    password: str = Field(min_length=1, max_length=200)


@dataclass
class _Counts:
    batches: int = 0
    certificates: int = 0


def _parse_uuid(value: str | None) -> uuid.UUID | None:
    try:
        return uuid.UUID(value) if value else None
    except ValueError:
        return None


def _apply(
    session: Session, row: EncryptedBatches, org_id: uuid.UUID, recipient: LegacyRecipient
) -> None:
    email = recipient.email if recipient.email and EMAIL.match(recipient.email) else None
    certificate_id = _parse_uuid(recipient.uuid)
    certificate = session.get(Certificates, certificate_id) if certificate_id else None
    if certificate is not None and certificate.batch_id == row.batch_id:
        certificate.recipient_name = recipient.name
        certificate.recipient_email = email
        certificate.rank = recipient.rank
        return
    session.add(
        Certificates(
            org_id=org_id,
            batch_id=row.batch_id,
            recipient_name=recipient.name,
            recipient_email=email,
            rank=recipient.rank,
            render_status=RenderStatus.PENDING,
        )
    )


def unlock_legacy_data(ctx: ActionContext, data: UnlockLegacyDataInput) -> ActionResult:
    user_id = ctx.caller.require_user()
    require_org_role(ctx.session, data.org_id, user_id, OWNERS)

    rows = ctx.session.scalars(
        select(EncryptedBatches)
        .join(Batches, Batches.id == EncryptedBatches.batch_id)
        .where(Batches.org_id == data.org_id, EncryptedBatches.unlocked_at.is_(None))
        .with_for_update(of=EncryptedBatches)
    ).all()
    if not rows:
        raise invalid("nothing-to-unlock", "There is no locked data for this organisation.")

    counts = _Counts()
    for row in rows:
        if row.encrypted_data is None or row.salt is None or row.iv is None:
            continue
        try:
            recipients = decrypt_recipients(row.encrypted_data, row.salt, row.iv, data.password)
        except LegacyDecryptError:
            continue  # this batch may have used another password
        for recipient in recipients:
            _apply(ctx.session, row, data.org_id, recipient)
        row.encrypted_data = row.salt = row.iv = None
        row.unlocked_at = datetime.now(UTC)
        counts.batches += 1
        counts.certificates += len(recipients)

    if counts.batches == 0:
        raise invalid("wrong-password", "This password did not unlock any certificates.")
    audit.record(
        ctx.session,
        org_id=data.org_id,
        actor_id=user_id,
        action="unlock",
        entity="legacy_data",
        data={"batches": counts.batches, "certificates": counts.certificates},
    )
    return {"unlocked_batches": counts.batches, "unlocked_certificates": counts.certificates}


ACTIONS: list[tuple[str, RegisteredAction]] = [
    action("unlock_legacy_data", UnlockLegacyDataInput, unlock_legacy_data),
]
