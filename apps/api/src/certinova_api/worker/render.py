import logging
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from certinova_api.db.models import Batches, BatchStatus, Certificates, Jobs, RenderStatus
from certinova_api.log import log_fields
from certinova_api.rendering.layout import TemplateLayout
from certinova_api.rendering.renderer import CertificateData
from certinova_api.services.jobs import JobTracker
from certinova_api.services.paths import (
    CERTIFICATES_BUCKET,
    TEMPLATES_BUCKET,
    certificate_key,
    verify_url,
)
from certinova_api.worker.context import WorkerContext

logger = logging.getLogger(__name__)


class RenderBatchTask:
    def __init__(self, context: WorkerContext) -> None:
        self._services = context.services
        self._renderer = context.renderer

    def run(self, job_id: uuid.UUID) -> None:
        with self._services.sessions() as session:
            job = session.get(Jobs, job_id)
            batch = session.get(Batches, job.ref_id) if job and job.ref_id else None
            if job is None or batch is None or not isinstance(batch.template_snapshot, dict):
                raise LookupError(f"render job {job_id} has no batch snapshot")

            tracker = JobTracker(session, job)
            batch.status = BatchStatus.RENDERING
            tracker.start()
            try:
                layout = TemplateLayout.from_snapshot(batch.template_snapshot)
                failed = self._render_all(session, tracker, batch, layout)
            except Exception as exc:
                logger.exception("render failed", extra=log_fields(job_id=job_id))
                tracker.fail(str(exc))
                batch.status = BatchStatus.FAILED
                session.commit()
                return

            rendered = job.total - failed
            batch.status = BatchStatus.READY if rendered > 0 else BatchStatus.FAILED
            tracker.finish({"rendered": rendered, "failed": failed})

    def _render_all(
        self, session: Session, tracker: JobTracker, batch: Batches, layout: TemplateLayout
    ) -> int:
        background = self._services.storage.download(TEMPLATES_BUCKET, layout.image_path)
        certificates = session.scalars(
            select(Certificates)
            .where(
                Certificates.batch_id == batch.id, Certificates.render_status != RenderStatus.DONE
            )
            .order_by(Certificates.created_at, Certificates.id)
        ).all()
        failed = 0
        for certificate in certificates:
            if not self._render_one(batch, certificate, background, layout):
                failed += 1
            tracker.advance()
        return failed

    def _render_one(
        self, batch: Batches, certificate: Certificates, background: bytes, layout: TemplateLayout
    ) -> bool:
        if certificate.recipient_name is None:
            certificate.render_status = RenderStatus.FAILED  # legacy data still locked
            return False
        try:
            png = self._renderer.render(
                background,
                layout,
                CertificateData(
                    certificate_id=str(certificate.id),
                    recipient_name=certificate.recipient_name,
                    rank=certificate.rank,
                    verify_url=verify_url(self._services.settings.frontend_url, certificate.id),
                ),
            )
            key = certificate_key(batch.org_id, batch.id, certificate.id)
            self._services.storage.upload(CERTIFICATES_BUCKET, key, png, "image/png")
        except Exception:
            logger.exception(
                "certificate render failed", extra=log_fields(certificate_id=certificate.id)
            )
            certificate.render_status = RenderStatus.FAILED
            return False
        certificate.file_path = key
        certificate.render_status = RenderStatus.DONE
        return True
