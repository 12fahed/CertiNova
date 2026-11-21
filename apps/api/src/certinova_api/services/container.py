from dataclasses import dataclass

from sqlalchemy.orm import Session, sessionmaker

from certinova_api.config import Settings
from certinova_api.db.session import create_session_factory
from certinova_api.services.mailer import LogMailer, Mailer, SmtpMailer
from certinova_api.services.queue import JobQueue, RqJobQueue
from certinova_api.services.storage import Storage, SupabaseStorage


@dataclass(frozen=True)
class Services:
    settings: Settings
    sessions: sessionmaker[Session]
    storage: Storage
    queue: JobQueue
    mailer: Mailer


def build_services(settings: Settings) -> Services:
    mailer: Mailer = (
        SmtpMailer(
            settings.smtp_host,
            settings.smtp_port,
            settings.smtp_username,
            settings.smtp_password.get_secret_value(),
            settings.smtp_starttls,
        )
        if settings.smtp_host
        else LogMailer()
    )
    return Services(
        settings=settings,
        sessions=create_session_factory(settings.database_url),
        storage=SupabaseStorage(
            settings.supabase_url, settings.supabase_service_role_key.get_secret_value()
        ),
        queue=RqJobQueue(settings.redis_url, settings.queue_name),
        mailer=mailer,
    )
