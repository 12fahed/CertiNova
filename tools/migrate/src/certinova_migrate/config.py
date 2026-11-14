from pydantic import MongoDsn, PostgresDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class MigrationSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongodb_uri: MongoDsn
    mongodb_db: str = "certinova"
    database_url: PostgresDsn
    supabase_url: str
    supabase_service_role_key: SecretStr
    dry_run: bool = True
