from tests.conftest import Seed
from tests.graphql_client import GraphQLClient


def test_outsider_sees_only_own_org_data(outsider: GraphQLClient, seed: Seed) -> None:
    data = outsider.data("{ organizations { id } events { org_id } certificates { id } }")

    assert data["organizations"] == [{"id": seed.other_org}]
    assert {e["org_id"] for e in data["events"]} == {seed.other_org}
    assert data["certificates"] == []


def test_outsider_cannot_read_demo_rows_by_id(outsider: GraphQLClient, seed: Seed) -> None:
    query = """
    query($org: uuid!, $cert: uuid!) {
      organizations_by_pk(id: $org) { id }
      certificates_by_pk(id: $cert) { id }
      org_stats(where: {org_id: {_eq: $org}}) { certificates_count }
    }
    """
    data = outsider.data(query, {"org": seed.demo_org, "cert": seed.certificate})

    assert data == {"organizations_by_pk": None, "certificates_by_pk": None, "org_stats": []}


def test_outsider_sees_no_demo_profiles(outsider: GraphQLClient, seed: Seed) -> None:
    profiles = outsider.data("{ profiles { id } }")["profiles"]

    assert profiles == [{"id": seed.outsider}]


def test_outsider_cannot_add_certificates_to_demo_batch(
    outsider: GraphQLClient, seed: Seed
) -> None:
    mutation = """
    mutation($org: uuid!, $batch: uuid!) {
      insert_certificates_one(
        object: {org_id: $org, batch_id: $batch, recipient_name: "Intruder"}
      ) { id }
    }
    """

    assert outsider.error_codes(mutation, {"org": seed.demo_org, "batch": seed.ready_batch}) == [
        "permission-error"
    ]
