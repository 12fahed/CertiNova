import uuid
from typing import Any

import pytest
from flask.testing import FlaskClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from certinova_api import create_app
from certinova_api.config import AppEnv, Settings
from certinova_api.hasura.blueprint import SECRET_HEADER
from certinova_api.services.container import Services
from tests.fakes import FakeMailer, FakeQueue, FakeStorage

SECRET = "test-action-secret"


@pytest.fixture
def client() -> FlaskClient:
    settings = Settings(
        _env_file=None, app_env=AppEnv.TEST, hasura_action_secret=SECRET, log_level="WARNING"
    )
    services = Services(
        settings=settings,
        sessions=sessionmaker(create_engine("sqlite://")),
        storage=FakeStorage(),
        queue=FakeQueue(),
        mailer=FakeMailer(),
    )
    return create_app(services=services).test_client()


def payload(name: str, data: dict[str, Any], role: str = "user") -> dict[str, Any]:
    session = {"x-hasura-role": role}
    if role == "user":
        session["x-hasura-user-id"] = str(uuid.uuid4())
    return {"action": {"name": name}, "input": data, "session_variables": session}


def test_rejects_a_missing_or_wrong_secret(client: FlaskClient) -> None:
    body = payload("bootstrap_org", {"name": "Org", "slug": "org"})

    assert client.post("/actions/bootstrap_org", json=body).status_code == 401
    response = client.post("/actions/bootstrap_org", json=body, headers={SECRET_HEADER: "nope"})
    assert response.status_code == 401
    assert response.get_json()["extensions"]["code"] == "unauthorized"


def test_unknown_action_is_404(client: FlaskClient) -> None:
    response = client.post("/actions/drop_tables", json={}, headers={SECRET_HEADER: SECRET})

    assert response.status_code == 404


def test_invalid_input_returns_hasura_error_shape(client: FlaskClient) -> None:
    response = client.post(
        "/actions/bootstrap_org",
        json=payload("bootstrap_org", {"name": "Org", "slug": "Not A Slug"}),
        headers={SECRET_HEADER: SECRET},
    )

    body = response.get_json()
    assert response.status_code == 400
    assert body["extensions"]["code"] == "invalid-input"
    assert body["message"].startswith("slug:")


def test_action_name_must_match_the_url(client: FlaskClient) -> None:
    response = client.post(
        "/actions/bootstrap_org",
        json=payload("accept_invite", {"name": "Org", "slug": "org-x"}),
        headers={SECRET_HEADER: SECRET},
    )

    assert response.status_code == 400


def test_user_actions_refuse_anonymous_callers(client: FlaskClient) -> None:
    response = client.post(
        "/actions/bootstrap_org",
        json=payload("bootstrap_org", {"name": "Org", "slug": "org-x"}, role="anonymous"),
        headers={SECRET_HEADER: SECRET},
    )

    assert response.status_code == 401
    assert response.get_json()["extensions"]["code"] == "unauthenticated"


def test_health(client: FlaskClient) -> None:
    assert client.get("/health").get_json() == {"status": "ok", "env": "test"}
