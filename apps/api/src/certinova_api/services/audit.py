import uuid
from typing import Any

from sqlalchemy.orm import Session

from certinova_api.db.models import AuditLog


def record(
    session: Session,
    *,
    org_id: uuid.UUID,
    actor_id: uuid.UUID | None,
    action: str,
    entity: str,
    entity_id: uuid.UUID | None = None,
    data: dict[str, Any] | None = None,
) -> None:
    session.add(
        AuditLog(
            org_id=org_id,
            actor_id=actor_id,
            action=action,
            entity=entity,
            entity_id=entity_id,
            data=data or {},
        )
    )
