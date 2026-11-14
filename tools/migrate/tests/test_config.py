import pytest
from pydantic import ValidationError

from certinova_migrate.config import MigrationSettings

VALID_ENV = {
    "MONGODB_URI": "mongodb+srv://user:pass@cluster0.example.mongodb.net",
    "DATABASE_URL": "postgresql://postgres:pass@localhost:5432/postgres",
    "SUPABASE_URL": "https://abc.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "service-key",
}


def test_defaults_to_dry_run(monkeypatch: pytest.MonkeyPatch) -> None:
    for key, value in VALID_ENV.items():
        monkeypatch.setenv(key, value)

    settings = MigrationSettings(_env_file=None)

    assert settings.dry_run is True
    assert settings.supabase_service_role_key.get_secret_value() == "service-key"


def test_rejects_non_postgres_database_url(monkeypatch: pytest.MonkeyPatch) -> None:
    for key, value in {**VALID_ENV, "DATABASE_URL": "mysql://x@localhost/db"}.items():
        monkeypatch.setenv(key, value)

    with pytest.raises(ValidationError):
        MigrationSettings(_env_file=None)
