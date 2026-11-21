from collections.abc import Callable

from tests.conftest import Seed
from tests.graphql_client import GraphQLClient

CREATE_DRAFT_BATCH = """
mutation($org: uuid!, $event: uuid!, $template: uuid!) {
  insert_batches_one(object: {
    org_id: $org, event_id: $event, template_id: $template, recipient_count: 2,
    certificates: {data: [
      {org_id: $org, recipient_name: "Test One"},
      {org_id: $org, recipient_name: "Test Two", recipient_email: "two@example.com"}
    ]}
  }) { id status created_by certificates { recipient_name } }
}
"""


def test_member_sees_only_own_organisation(member: GraphQLClient, seed: Seed) -> None:
    orgs = member.data("{ organizations { id } }")["organizations"]

    assert orgs == [{"id": seed.demo_org}]


def test_member_reads_org_certificates(member: GraphQLClient) -> None:
    data = member.data("{ certificates_aggregate { aggregate { count } } }")

    assert data["certificates_aggregate"]["aggregate"]["count"] >= 3


def test_member_cannot_create_events(member: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($org: uuid!) {
      insert_events_one(object: {org_id: $org, name: "Gala", issuer_name: "Dean"}) { id }
    }
    """

    assert member.error_codes(mutation, {"org": seed.demo_org}) == ["permission-error"]


def test_member_creates_draft_batch_with_certificates(
    member: GraphQLClient, seed: Seed, cleanup: Callable[[str, str], None]
) -> None:
    batch = member.data(
        CREATE_DRAFT_BATCH,
        {"org": seed.demo_org, "event": seed.demo_event, "template": seed.demo_template},
    )["insert_batches_one"]
    cleanup("batches", batch["id"])

    assert batch["status"] == "draft"
    assert batch["created_by"] == seed.member
    assert sorted(c["recipient_name"] for c in batch["certificates"]) == ["Test One", "Test Two"]


def test_member_cannot_add_certificates_to_rendered_batch(
    member: GraphQLClient, seed: Seed
) -> None:
    mutation = """
    mutation($org: uuid!, $batch: uuid!) {
      insert_certificates_one(
        object: {org_id: $org, batch_id: $batch, recipient_name: "Late"}
      ) { id }
    }
    """

    codes = member.error_codes(mutation, {"org": seed.demo_org, "batch": seed.ready_batch})
    assert codes == ["permission-error"]


def test_member_cannot_set_batch_status(member: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($org: uuid!, $event: uuid!, $template: uuid!) {
      insert_batches_one(
        object: {org_id: $org, event_id: $event, template_id: $template, status: ready}
      ) { id }
    }
    """

    codes = member.error_codes(
        mutation, {"org": seed.demo_org, "event": seed.demo_event, "template": seed.demo_template}
    )
    assert codes == ["validation-failed"]


def test_member_cannot_revoke_certificates(member: GraphQLClient, seed: Seed) -> None:
    mutation = """
    mutation($id: uuid!) {
      update_certificates_by_pk(pk_columns: {id: $id}, _set: {revoked_at: "now()"}) { id }
    }
    """

    assert member.data(mutation, {"id": seed.certificate})["update_certificates_by_pk"] is None


def test_member_cannot_read_audit_log_or_invites(member: GraphQLClient) -> None:
    data = member.data("{ audit_log { id } organization_invites { id } }")

    assert data == {"audit_log": [], "organization_invites": []}


def test_invite_token_hash_is_never_exposed(owner: GraphQLClient) -> None:
    assert owner.error_codes("{ organization_invites { token_hash } }") == ["validation-failed"]
