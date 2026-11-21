import re

import pytest
from sqlalchemy.orm import Session, sessionmaker

from tests.integration.conftest import Harness, World
from tests.integration.data import scalar

pytestmark = pytest.mark.integration


def test_bootstrap_org_makes_the_caller_owner(
    harness: Harness, world: World, sessions: sessionmaker[Session]
) -> None:
    org_id = harness.ok(
        "bootstrap_org", {"name": "New Org", "slug": f"new-{world.tag}"}, world.outsider
    )["org_id"]
    try:
        role = scalar(
            sessions,
            "select role::text from public.organization_members where org_id = :o and user_id = :u",
            o=org_id,
            u=world.outsider,
        )
        assert role == "owner"
        assert (
            harness.error_code(
                "bootstrap_org", {"name": "Again", "slug": f"new-{world.tag}"}, world.outsider
            )
            == "slug-taken"
        )
    finally:
        with sessions.begin() as s:
            from sqlalchemy import text

            s.execute(text("delete from public.organizations where id = :id"), {"id": org_id})


def test_invite_and_accept(harness: Harness, world: World, sessions: sessionmaker[Session]) -> None:
    invite = {
        "org_id": str(world.org_id),
        "email": world.email(world.outsider).upper(),
        "role": "member",
    }

    assert harness.error_code("invite_member", invite, world.member) == "forbidden"
    harness.ok("invite_member", invite, world.admin)

    assert len(harness.mailer.sent) == 1
    sent = harness.mailer.sent[0]
    assert sent["To"] == world.email(world.outsider)
    token = re.search(r"token=([\w-]+)", sent.get_body(("plain",)).get_content()).group(1)  # type: ignore[union-attr]

    assert harness.error_code("accept_invite", {"token": token}, world.member) == "forbidden"
    assert harness.ok("accept_invite", {"token": token}, world.outsider) == {
        "org_id": str(world.org_id)
    }
    assert (
        scalar(
            sessions,
            "select role::text from public.organization_members where org_id = :o and user_id = :u",
            o=world.org_id,
            u=world.outsider,
        )
        == "member"
    )
    assert harness.error_code("accept_invite", {"token": token}, world.outsider) == "invite-invalid"


def test_cannot_invite_an_existing_member(harness: Harness, world: World) -> None:
    invite = {"org_id": str(world.org_id), "email": world.email(world.member), "role": "admin"}

    assert harness.error_code("invite_member", invite, world.owner) == "already-member"
    assert harness.mailer.sent == []
