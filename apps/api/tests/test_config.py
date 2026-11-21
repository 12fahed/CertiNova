import pytest
from pydantic import SecretStr, ValidationError

from certinova_api.config import AppEnv, Settings


def test_local_defaults_are_allowed_in_dev() -> None:
    assert Settings(_env_file=None, app_env=AppEnv.DEV).hasura_action_secret.get_secret_value()


def test_deployed_env_refuses_local_defaults() -> None:
    with pytest.raises(ValidationError, match="HASURA_ACTION_SECRET"):
        Settings(_env_file=None, app_env=AppEnv.PROD)


def test_deployed_env_accepts_real_values() -> None:
    settings = Settings(
        _env_file=None,
        app_env=AppEnv.PROD,
        hasura_action_secret=SecretStr("a-long-random-secret"),
        supabase_service_role_key=SecretStr("sb_secret_x"),
        database_url="postgresql://u:p@db.example.supabase.co:5432/postgres",
    )

    assert settings.is_deployed
