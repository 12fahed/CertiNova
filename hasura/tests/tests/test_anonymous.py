from tests.conftest import Seed
from tests.graphql_client import GraphQLClient

VERIFY = """
query($id: uuid!) {
  verify_certificate(args: {certificate_id: $id}) {
    organisation_name event_name recipient_name rank is_revoked
  }
}
"""


def test_verify_returns_public_details(anonymous: GraphQLClient, seed: Seed) -> None:
    rows = anonymous.data(VERIFY, {"id": seed.certificate})["verify_certificate"]

    assert rows == [
        {
            "organisation_name": "Demo University",
            "event_name": "Spring Hackathon 2026",
            "recipient_name": "Aarav Sharma",
            "rank": "1st",
            "is_revoked": False,
        }
    ]


def test_verify_unknown_id_returns_nothing(anonymous: GraphQLClient) -> None:
    rows = anonymous.data(VERIFY, {"id": "00000000-0000-4000-8000-000000000000"})

    assert rows["verify_certificate"] == []


def test_verify_never_exposes_email(anonymous: GraphQLClient, seed: Seed) -> None:
    query = (
        "query($id: uuid!) { verify_certificate(args: {certificate_id: $id}) { recipient_email } }"
    )

    assert anonymous.error_codes(query, {"id": seed.certificate}) == ["validation-failed"]


def test_anonymous_schema_is_verify_only(anonymous: GraphQLClient) -> None:
    assert anonymous.root_fields("query") == {"verify_certificate", "get_verify_preview_url"}
    assert anonymous.root_fields("mutation") == set()
