from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


def to_psycopg_url(database_url: str) -> str:
    for prefix in ("postgresql://", "postgres://"):
        if database_url.startswith(prefix):
            return "postgresql+psycopg://" + database_url.removeprefix(prefix)
    return database_url


def create_session_factory(database_url: str) -> sessionmaker[Session]:
    engine = create_engine(to_psycopg_url(database_url), pool_pre_ping=True)
    return sessionmaker(engine, expire_on_commit=False)
