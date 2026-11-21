import base64
import json

from tests.conftest import Stack
from tests.graphql_client import GraphQLClient

EXPECTED_USER_MUTATIONS = {
    "bootstrap_org",
    "invite_member",
    "accept_invite",
    "start_batch_render",
    "export_batch",
    "send_batch_emails",
    "unlock_legacy_data",
}


def _b64(data: dict[str, object]) -> str:
    return base64.urlsafe_b64encode(json.dumps(data).encode()).rstrip(b"=").decode()


def test_forged_token_is_rejected(stack: Stack) -> None:
    header = _b64({"alg": "ES256", "typ": "JWT", "kid": "forged"})
    claims = _b64(
        {
            "sub": "a0000000-0000-4000-8000-000000000001",
            "https://hasura.io/jwt/claims": {
                "x-hasura-default-role": "user",
                "x-hasura-allowed-roles": ["user"],
                "x-hasura-user-id": "a0000000-0000-4000-8000-000000000001",
            },
        }
    )
    client = GraphQLClient(stack.graphql_url, {"Authorization": f"Bearer {header}.{claims}.c2ln"})

    assert client.error_codes("{ organizations { id } }") == ["invalid-jwt"]


def test_user_role_cannot_switch_to_admin(member: GraphQLClient) -> None:
    client = GraphQLClient(member.url, {**member.headers, "x-hasura-role": "admin"})

    assert client.error_codes("{ organizations { id } }") == ["access-denied"]


def test_user_sees_all_actions(member: GraphQLClient) -> None:
    assert member.root_fields("mutation") >= EXPECTED_USER_MUTATIONS
    assert {
        "get_export_url",
        "get_verify_preview_url",
        "verify_certificate",
    } <= member.root_fields()
