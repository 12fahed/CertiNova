from enum import StrEnum
from functools import lru_cache
from pathlib import Path
from typing import Self

from pydantic import SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

LOCAL_ACTION_SECRET = "local-action-secret"


class AppEnv(StrEnum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"
    TEST = "test"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: AppEnv = AppEnv.DEV
    log_level: str = "INFO"

    database_url: str = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
    redis_url: str = "redis://localhost:6379/0"
    queue_name: str = "certinova"

    hasura_action_secret: SecretStr = SecretStr(LOCAL_ACTION_SECRET)

    supabase_url: str = "http://127.0.0.1:54321"
    supabase_service_role_key: SecretStr = SecretStr("")
    signed_url_ttl_seconds: int = 600

    frontend_url: str = "http://localhost:5173"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: SecretStr = SecretStr("")
    smtp_starttls: bool = True
    email_from_address: str = "CertiNova <no-reply@certinova.local>"

    fonts_dir: Path = Path("fonts")
    fonts_download: bool = True

    @property
    def is_deployed(self) -> bool:
        return self.app_env in (AppEnv.STAGING, AppEnv.PROD)

    @model_validator(mode="after")
    def _require_real_secrets_when_deployed(self) -> Self:
        if not self.is_deployed:
            return self
        missing = [
            name
            for name, bad in (
                (
                    "HASURA_ACTION_SECRET",
                    self.hasura_action_secret.get_secret_value() == LOCAL_ACTION_SECRET,
                ),
                (
                    "SUPABASE_SERVICE_ROLE_KEY",
                    not self.supabase_service_role_key.get_secret_value(),
                ),
                (
                    "DATABASE_URL",
                    "127.0.0.1" in self.database_url or "localhost" in self.database_url,
                ),
            )
            if bad
        ]
        if missing:
            raise ValueError(f"{self.app_env} needs real values for: {', '.join(missing)}")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
