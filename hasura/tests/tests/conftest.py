import os
from collections.abc import Callable, Iterator
from dataclasses import dataclass

import httpx
import pytest

from tests.graphql_client import GraphQLClient

SEED_PASSWORD = "password123"


@dataclass(frozen=True)
class Seed:
    demo_org = "b0000000-0000-4000-8000-000000000001"
    other_org = "b0000000-0000-4000-8000-000000000002"
    owner = "a0000000-0000-4000-8000-000000000001"
    admin = "a0000000-0000-4000-8000-000000000002"
    member = "a0000000-0000-4000-8000-000000000003"
    outsider = "a0000000-0000-4000-8000-000000000004"
    demo_event = "c0000000-0000-4000-8000-000000000001"
    demo_template = "d0000000-0000-4000-8000-000000000001"
    ready_batch = "e0000000-0000-4000-8000-000000000001"
    certificate = "f0000000-0000-4000-8000-000000000001"


@dataclass(frozen=True)
class Stack:
    graphql_url: str
    supabase_url: str
    anon_key: str
    admin_secret: str


@pytest.fixture(scope="session")
def stack() -> Stack:
    anon_key = os.environ.get("SUPABASE_ANON_KEY")
    if not anon_key:
        pytest.skip(
            "SUPABASE_ANON_KEY is not set; start the local stack first (see hasura/README.md)"
        )
    return Stack(
        graphql_url=os.environ.get("HASURA_GRAPHQL_URL", "http://localhost:8080/v1/graphql"),
        supabase_url=os.environ.get("SUPABASE_URL", "http://127.0.0.1:54321"),
        anon_key=anon_key,
        admin_secret=os.environ.get("HASURA_GRAPHQL_ADMIN_SECRET", "local-admin-secret"),
    )


@pytest.fixture(scope="session")
def seed() -> Seed:
    return Seed()


@pytest.fixture(scope="session")
def login(stack: Stack) -> Callable[[str], GraphQLClient]:
    cache: dict[str, GraphQLClient] = {}

    def _login(email: str) -> GraphQLClient:
        if email not in cache:
            response = httpx.post(
                f"{stack.supabase_url}/auth/v1/token?grant_type=password",
                headers={"apikey": stack.anon_key},
                json={"email": email, "password": SEED_PASSWORD},
                timeout=10,
            )
            response.raise_for_status()
            token = response.json()["access_token"]
            cache[email] = GraphQLClient(stack.graphql_url, {"Authorization": f"Bearer {token}"})
        return cache[email]

    return _login


@pytest.fixture(scope="session")
def anonymous(stack: Stack) -> GraphQLClient:
    return GraphQLClient(stack.graphql_url, {})


@pytest.fixture(scope="session")
def owner(login: Callable[[str], GraphQLClient]) -> GraphQLClient:
    return login("owner@certinova.local")


@pytest.fixture(scope="session")
def admin(login: Callable[[str], GraphQLClient]) -> GraphQLClient:
    return login("admin@certinova.local")


@pytest.fixture(scope="session")
def member(login: Callable[[str], GraphQLClient]) -> GraphQLClient:
    return login("member@certinova.local")


@pytest.fixture(scope="session")
def outsider(login: Callable[[str], GraphQLClient]) -> GraphQLClient:
    return login("outsider@certinova.local")


@pytest.fixture(scope="session")
def hasura_admin(stack: Stack) -> GraphQLClient:
    return GraphQLClient(stack.graphql_url, {"x-hasura-admin-secret": stack.admin_secret})


@pytest.fixture
def cleanup(hasura_admin: GraphQLClient) -> Iterator[Callable[[str, str], None]]:
    """Register rows to delete after the test: cleanup("events", id)."""
    rows: list[tuple[str, str]] = []
    yield lambda table, row_id: rows.append((table, row_id))
    for table, row_id in reversed(rows):
        hasura_admin.data(
            f"mutation($id: uuid!) {{ delete_{table}_by_pk(id: $id) {{ id }} }}", {"id": row_id}
        )
