import logging
import tempfile
import uuid
from pathlib import Path

from sqlalchemy import select

from certinova_api.db.models import Certificates, Jobs
from certinova_api.log import log_fields
from certinova_api.services.jobs import JobTracker
from certinova_api.services.paths import CERTIFICATES_BUCKET, EXPORTS_BUCKET, export_key
from certinova_api.worker.context import WorkerContext
from certinova_api.worker.exporters import FORMATS, ExportFile, unique_file_names, write_export

logger = logging.getLogger(__name__)


class ExportBatchTask:
    def __init__(self, context: WorkerContext) -> None:
        self._services = context.services

    def run(self, job_id: uuid.UUID) -> None:
        with self._services.sessions() as session:
            job = session.get(Jobs, job_id)
            fmt = job.result.get("format") if job and isinstance(job.result, dict) else None
            if job is None or job.ref_id is None or fmt not in FORMATS:
                raise LookupError(f"export job {job_id} is not valid")

            tracker = JobTracker(session, job)
            tracker.start()
            certificates = session.scalars(
                select(Certificates)
                .where(Certificates.batch_id == job.ref_id, Certificates.file_path.is_not(None))
                .order_by(Certificates.recipient_name, Certificates.id)
            ).all()
            try:
                with tempfile.TemporaryDirectory() as tmp:
                    workdir = Path(tmp)
                    names = unique_file_names(c.recipient_name or str(c.id) for c in certificates)
                    files = []
                    for certificate, name in zip(certificates, names, strict=True):
                        png = workdir / f"{certificate.id}.png"
                        png.write_bytes(
                            self._services.storage.download(
                                CERTIFICATES_BUCKET, str(certificate.file_path)
                            )
                        )
                        files.append(ExportFile(name, png))
                        tracker.advance()

                    spec = FORMATS[fmt]
                    out_path = workdir / f"export.{spec.extension}"
                    write_export(fmt, files, out_path)
                    key = export_key(job.org_id, job.id, spec.extension)
                    self._services.storage.upload(
                        EXPORTS_BUCKET, key, out_path.read_bytes(), spec.content_type
                    )
            except Exception as exc:
                logger.exception("export failed", extra=log_fields(job_id=job_id))
                tracker.fail(str(exc))
                return
            tracker.finish({"format": fmt, "path": key, "files": len(files)})
