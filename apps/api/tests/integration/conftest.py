import os
import uuid
from collections.abc import Iterator
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import pytest
from flask.testing import FlaskClient
from sqlalchemy import text
from sqlalchemy.orm import Session, sessionmaker

from certinova_api import create_app
from certinova_api.config import AppEnv, Settings
from certinova_api.db.session import create_session_factory
from certinova_api.hasura.blueprint import SECRET_HEADER
from certinova_api.services.container import Services
from certinova_api.worker.context import WorkerContext, build_worker_context
from tests.fakes import FakeMailer, FakeQueue, FakeStorage
from tests.images import png

SECRET = "integration-secret"
TEMPLATE_SIZE = (800, 600)


@pytest.fixture(scope="session")
def sessions() -> Iterator[sessionmaker[Session]]:
    url = os.environ.get("DATABASE_URL")
    if not url:
        pytest.skip("DATABASE_URL is not set; integration tests need the local Supabase stack")
    factory = create_session_factory(url)
    yield factory
    factory.kw["bind"].dispose()


@dataclass
class World:
    org_id: uuid.UUID = field(default_factory=uuid.uuid4)
    other_org_id: uuid.UUID = field(default_factory=uuid.uuid4)
    owner: uuid.UUID = field(default_factory=uuid.uuid4)
    admin: uuid.UUID = field(default_factory=uuid.uuid4)
    member: uuid.UUID = field(default_factory=uuid.uuid4)
    outsider: uuid.UUID = field(default_factory=uuid.uuid4)
    event_id: uuid.UUID = field(default_factory=uuid.uuid4)
    template_id: uuid.UUID = field(default_factory=uuid.uuid4)
    tag: str = field(default_factory=lambda: uuid.uuid4().hex[:8])

    def email(self, user: uuid.UUID) -> str:
        return f"{user}@it.certinova.test"

    @property
    def template_path(self) -> str:
        return f"{self.org_id}/{self.template_id}.png"

    @property
    def users(self) -> list[uuid.UUID]:
        return [self.owner, self.admin, self.member, self.outsider]


@pytest.fixture
def world(sessions: sessionmaker[Session]) -> Iterator[World]:
    w = World()
    with sessions.begin() as s:
        for user in w.users:
            s.execute(
                text(
                    "insert into auth.users (id, email, raw_user_meta_data) "
                    "values (:id, :email, '{}')"
                ),
                {"id": user, "email": w.email(user)},
            )
        s.execute(
            text(
                "insert into public.organizations (id, name, slug) values "
                "(:org, 'IT Org', :slug), (:other, 'IT Other', :other_slug)"
            ),
            {
                "org": w.org_id,
                "slug": f"it-{w.tag}",
                "other": w.other_org_id,
                "other_slug": f"it-other-{w.tag}",
            },
        )
        s.execute(
            text(
                "insert into public.organization_members (org_id, user_id, role) values "
                "(:org, :owner, 'owner'), (:org, :admin, 'admin'), (:org, :member, 'member'), "
                "(:other, :outsider, 'owner')"
            ),
            {
                "org": w.org_id,
                "other": w.other_org_id,
                "owner": w.owner,
                "admin": w.admin,
                "member": w.member,
                "outsider": w.outsider,
            },
        )
        s.execute(
            text(
                "insert into public.events (id, org_id, name, issuer_name) "
                "values (:event, :org, 'IT Event', 'IT Issuer')"
            ),
            {"event": w.event_id, "org": w.org_id},
        )
        s.execute(
            text(
                "insert into public.templates "
                "(id, org_id, event_id, image_path, image_width, image_height) "
                "values (:template, :org, :event, :path, :w, :h)"
            ),
            {
                "template": w.template_id,
                "org": w.org_id,
                "event": w.event_id,
                "path": w.template_path,
                "w": TEMPLATE_SIZE[0],
                "h": TEMPLATE_SIZE[1],
            },
        )
        s.execute(
            text(
                "insert into public.template_fields "
                "(template_id, field_key, x, y, width, height, font_family) "
                "values (:t, 'recipient_name', 100, 100, 600, 100, 'Great Vibes'), "
                "(:t, 'certificate_qr', 600, 400, 150, 150, 'Inter')"
            ),
            {"t": w.template_id},
        )
    yield w
    with sessions.begin() as s:
        s.execute(
            text("delete from public.organizations where id in (:a, :b)"),
            {"a": w.org_id, "b": w.other_org_id},
        )
        s.execute(text("delete from auth.users where id = any(:ids)"), {"ids": w.users})


@dataclass
class Harness:
    client: FlaskClient
    services: Services
    storage: FakeStorage
    queue: FakeQueue
    mailer: FakeMailer
    worker: WorkerContext

    def call(
        self, name: str, data: dict[str, Any], user: uuid.UUID | None = None
    ) -> tuple[int, Any]:
        session: dict[str, str] = {"x-hasura-role": "user" if user else "anonymous"}
        if user:
            session["x-hasura-user-id"] = str(user)
        response = self.client.post(
            f"/actions/{name}",
            json={"action": {"name": name}, "input": data, "session_variables": session},
            headers={SECRET_HEADER: SECRET},
        )
        return response.status_code, response.get_json()

    def ok(self, name: str, data: dict[str, Any], user: uuid.UUID | None = None) -> Any:
        status, body = self.call(name, data, user)
        assert status == 200, body
        return body

    def error_code(self, name: str, data: dict[str, Any], user: uuid.UUID | None = None) -> str:
        status, body = self.call(name, data, user)
        assert status >= 400, body
        return str(body["extensions"]["code"])


@pytest.fixture
def harness(sessions: sessionmaker[Session], world: World, tmp_path: Path) -> Harness:
    settings = Settings(
        _env_file=None,
        app_env=AppEnv.TEST,
        hasura_action_secret=SECRET,
        frontend_url="https://certinova.test",
        fonts_dir=tmp_path / "fonts",
        fonts_download=False,
        log_level="WARNING",
    )
    storage, queue, mailer = FakeStorage(), FakeQueue(), FakeMailer()
    storage.upload("templates", world.template_path, png(*TEMPLATE_SIZE), "image/png")
    services = Services(settings, sessions, storage, queue, mailer)
    return Harness(
        client=create_app(services=services).test_client(),
        services=services,
        storage=storage,
        queue=queue,
        mailer=mailer,
        worker=build_worker_context(services),
    )
