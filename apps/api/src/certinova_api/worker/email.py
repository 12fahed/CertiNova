import logging
import uuid
from datetime import UTC, datetime

from sqlalchemy import select

from certinova_api.db.models import (
    Batches,
    Certificates,
    DeliveryStatus,
    EmailDeliveries,
    Events,
    Jobs,
    Organizations,
)
from certinova_api.log import log_fields
from certinova_api.services.emails import certificate_email
from certinova_api.services.jobs import JobTracker
from certinova_api.services.paths import CERTIFICATES_BUCKET, verify_url
from certinova_api.worker.context import WorkerContext
from certinova_api.worker.exporters import unique_file_names

logger = logging.getLogger(__name__)


class SendBatchEmailsTask:
    def __init__(self, context: WorkerContext) -> None:
        self._services = context.services

    def run(self, job_id: uuid.UUID) -> None:
        with self._services.sessions() as session:
            job = session.get(Jobs, job_id)
            batch = session.get(Batches, job.ref_id) if job and job.ref_id else None
            event = session.get(Events, batch.event_id) if batch else None
            org = session.get(Organizations, batch.org_id) if batch else None
            if job is None or batch is None or event is None or org is None:
                raise LookupError(f"email job {job_id} is not valid")

            tracker = JobTracker(session, job)
            tracker.start()
            rows = session.execute(
                select(EmailDeliveries, Certificates)
                .join(Certificates, Certificates.id == EmailDeliveries.certificate_id)
                .where(
                    Certificates.batch_id == batch.id,
                    EmailDeliveries.status == DeliveryStatus.QUEUED,
                )
            ).all()
            settings = self._services.settings
            sent = failed = 0
            for delivery, certificate in rows:
                delivery.attempts += 1
                try:
                    png = self._services.storage.download(
                        CERTIFICATES_BUCKET, str(certificate.file_path)
                    )
                    name = certificate.recipient_name or "Recipient"
                    self._services.mailer.send(
                        certificate_email(
                            sender=settings.email_from_address,
                            to=delivery.email,
                            recipient_name=name,
                            event_name=event.name,
                            organisation_name=org.name,
                            verify_url=verify_url(settings.frontend_url, certificate.id),
                            png=png,
                            file_name=f"{unique_file_names([name])[0]}.png",
                        )
                    )
                except Exception as exc:
                    logger.warning(
                        "email failed", extra=log_fields(delivery_id=delivery.id, error=str(exc))
                    )
                    delivery.status = DeliveryStatus.FAILED
                    delivery.error = str(exc)[:500]
                    failed += 1
                else:
                    delivery.status = DeliveryStatus.SENT
                    delivery.sent_at = datetime.now(UTC)
                    delivery.error = None
                    sent += 1
                tracker.advance()
            tracker.finish({"sent": sent, "failed": failed})
