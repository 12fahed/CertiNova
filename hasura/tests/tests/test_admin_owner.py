from collections.abc import Callable

from tests.conftest import Seed
from tests.graphql_client import GraphQLClient

SET_ROLE = """
mutation($org: uuid!, $user: uuid!, $role: org_role!) {
  update_organization_members_by_pk(
    pk_columns: {org_id: $org, user_id: $user}, _set: {role: $role}
  ) {
    role
  }
}
"""


def test_admin_creates_event_as_self(
    admin: GraphQLClient, seed: Seed, cleanup: Callable[[str, str], None]
) -> None:
    mutation = """
    mutation($org: uuid!) {
      insert_events_one(object: {org_id: $org, name: "Annual Gala", issuer_name: "Dean"}) {
        id created_by
      }
    }
    """
    event = admin.data(mutation, {"org": seed.demo_org})["insert_events_one"]
    cleanup("events", event["id"])

    assert event["created_by"] == seed.admin


def test_admin_cannot_create_event_in_other_org(admin: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($org: uuid!) {
      insert_events_one(object: {org_id: $org, name: "Hijack", issuer_name: "Dean"}) { id }
    }
    """

    assert admin.error_codes(mutation, {"org": seed.other_org}) == ["permission-error"]


def test_admin_cannot_grant_owner(admin: GraphQLClient, seed: Seed) -> None:
    codes = admin.error_codes(
        SET_ROLE, {"org": seed.demo_org, "user": seed.member, "role": "owner"}
    )

    assert codes == ["permission-error"]


def test_admin_cannot_demote_owner(admin: GraphQLClient, seed: Seed) -> None:
    data = admin.data(SET_ROLE, {"org": seed.demo_org, "user": seed.owner, "role": "member"})

    assert data["update_organization_members_by_pk"] is None


def test_admin_updates_org_settings(admin: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($org: uuid!, $show: Boolean!) {
      update_organizations_by_pk(pk_columns: {id: $org}, _set: {show_name_on_verify: $show}) {
        show_name_on_verify
      }
    }
    """
    try:
        data = admin.data(mutation, {"org": seed.demo_org, "show": False})
        assert data["update_organizations_by_pk"] == {"show_name_on_verify": False}
    finally:
        admin.data(mutation, {"org": seed.demo_org, "show": True})


def test_member_cannot_update_org_settings(member: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($org: uuid!) {
      update_organizations_by_pk(pk_columns: {id: $org}, _set: {show_name_on_verify: false}) { id }
    }
    """

    assert member.data(mutation, {"org": seed.demo_org})["update_organizations_by_pk"] is None


def test_owner_grants_and_removes_owner_role(owner: GraphQLClient, seed: Seed) -> None:
    try:
        granted = owner.data(SET_ROLE, {"org": seed.demo_org, "user": seed.member, "role": "owner"})
        assert granted["update_organization_members_by_pk"] == {"role": "owner"}
    finally:
        owner.data(SET_ROLE, {"org": seed.demo_org, "user": seed.member, "role": "member"})
