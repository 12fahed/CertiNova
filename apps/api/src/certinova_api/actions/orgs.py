import uuid
from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

from certinova_api.db.models import (
    OrganizationInvites,
    OrganizationMembers,
    Organizations,
    OrgRole,
    Profiles,
)
from certinova_api.hasura.errors import conflict, forbidden, invalid, not_found
from certinova_api.hasura.registry import ActionContext, ActionResult, RegisteredAction, action
from certinova_api.services import audit
from certinova_api.services.access import ADMINS, require_org_role
from certinova_api.services.emails import invite_email
from certinova_api.services.tokens import hash_token, new_invite_token

SLUG_PATTERN = r"^[a-z0-9]+(-[a-z0-9]+)*$"
EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class BootstrapOrgInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    slug: str = Field(min_length=3, max_length=64, pattern=SLUG_PATTERN)

    @field_validator("name")
    @classmethod
    def _strip(cls, value: str) -> str:
        return value.strip()


class InviteMemberInput(BaseModel):
    org_id: uuid.UUID
    email: str = Field(max_length=320, pattern=EMAIL_PATTERN)
    role: Literal["admin", "member"]

    @field_validator("email")
    @classmethod
    def _normalise(cls, value: str) -> str:
        return value.strip().lower()


class AcceptInviteInput(BaseModel):
    token: str = Field(min_length=20, max_length=200)


def bootstrap_org(ctx: ActionContext, data: BootstrapOrgInput) -> ActionResult:
    user_id = ctx.caller.require_user()
    if ctx.session.scalar(select(Organizations.id).where(Organizations.slug == data.slug)):
        raise conflict("slug-taken", "That address is taken. Pick another one.")

    org = Organizations(name=data.name, slug=data.slug)
    ctx.session.add(org)
    try:
        ctx.session.flush()
    except IntegrityError as exc:
        raise conflict("slug-taken", "That address is taken. Pick another one.") from exc
    ctx.session.add(OrganizationMembers(org_id=org.id, user_id=user_id, role=OrgRole.OWNER))
    audit.record(
        ctx.session,
        org_id=org.id,
        actor_id=user_id,
        action="create",
        entity="organization",
        entity_id=org.id,
    )
    return {"org_id": str(org.id)}


def invite_member(ctx: ActionContext, data: InviteMemberInput) -> ActionResult:
    user_id = ctx.caller.require_user()
    require_org_role(ctx.session, data.org_id, user_id, ADMINS)

    already_member = ctx.session.scalar(
        select(OrganizationMembers.user_id)
        .join(Profiles, Profiles.id == OrganizationMembers.user_id)
        .where(OrganizationMembers.org_id == data.org_id, Profiles.email == data.email)
    )
    if already_member:
        raise conflict("already-member", "This person is already a member.")

    ctx.session.execute(
        delete(OrganizationInvites).where(
            OrganizationInvites.org_id == data.org_id,
            OrganizationInvites.email == data.email,
            OrganizationInvites.accepted_at.is_(None),
        )
    )
    token, token_hash = new_invite_token()
    invite = OrganizationInvites(
        org_id=data.org_id,
        email=data.email,
        role=OrgRole(data.role),
        token_hash=token_hash,
        invited_by=user_id,
    )
    ctx.session.add(invite)
    ctx.session.flush()

    org = ctx.session.get(Organizations, data.org_id)
    inviter = ctx.session.get(Profiles, user_id)
    if org is None or inviter is None:
        raise not_found("Organization")
    settings = ctx.services.settings
    message = invite_email(
        sender=settings.email_from_address,
        to=data.email,
        organisation_name=org.name,
        inviter_name=inviter.full_name or inviter.email,
        accept_url=f"{settings.frontend_url.rstrip('/')}/invites/accept?token={token}",
    )
    ctx.after_commit(lambda: ctx.services.mailer.send(message))
    audit.record(
        ctx.session,
        org_id=data.org_id,
        actor_id=user_id,
        action="invite",
        entity="organization_invite",
        entity_id=invite.id,
        data={"email": data.email, "role": data.role},
    )
    return {"invite_id": str(invite.id)}


def accept_invite(ctx: ActionContext, data: AcceptInviteInput) -> ActionResult:
    user_id = ctx.caller.require_user()
    invite = ctx.session.scalar(
        select(OrganizationInvites)
        .where(OrganizationInvites.token_hash == hash_token(data.token))
        .with_for_update()
    )
    if invite is None or invite.accepted_at is not None or invite.expires_at <= datetime.now(UTC):
        raise invalid("invite-invalid", "This invite is not valid. Ask for a new one.")

    profile = ctx.session.get(Profiles, user_id)
    if profile is None or profile.email.lower() != invite.email.lower():
        raise forbidden("This invite is for a different email address.")

    membership = ctx.session.get(OrganizationMembers, (invite.org_id, user_id))
    if membership is None:
        ctx.session.add(
            OrganizationMembers(org_id=invite.org_id, user_id=user_id, role=invite.role)
        )
    invite.accepted_at = datetime.now(UTC)
    audit.record(
        ctx.session,
        org_id=invite.org_id,
        actor_id=user_id,
        action="accept",
        entity="organization_invite",
        entity_id=invite.id,
    )
    return {"org_id": str(invite.org_id)}


ACTIONS: list[tuple[str, RegisteredAction]] = [
    action("bootstrap_org", BootstrapOrgInput, bootstrap_org),
    action("invite_member", InviteMemberInput, invite_member),
    action("accept_invite", AcceptInviteInput, accept_invite),
]
