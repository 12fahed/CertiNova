import uuid
from collections.abc import Collection

from sqlalchemy import select
from sqlalchemy.orm import Session

from certinova_api.db.models import OrganizationMembers, OrgRole
from certinova_api.hasura.errors import forbidden

ANY_ROLE = frozenset(OrgRole)
ADMINS = frozenset({OrgRole.OWNER, OrgRole.ADMIN})
OWNERS = frozenset({OrgRole.OWNER})


def require_org_role(
    session: Session, org_id: uuid.UUID, user_id: uuid.UUID, roles: Collection[OrgRole] = ANY_ROLE
) -> OrgRole:
    """Return the caller's role in the organisation, or refuse if it is not in `roles`."""
    role = session.scalar(
        select(OrganizationMembers.role).where(
            OrganizationMembers.org_id == org_id, OrganizationMembers.user_id == user_id
        )
    )
    if role is None or role not in roles:
        raise forbidden()
    return role
