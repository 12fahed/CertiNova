import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy.orm import Session

from certinova_api.db.models import JobKind, Jobs, JobStatus


def create_job(
    session: Session,
    *,
    org_id: uuid.UUID,
    kind: JobKind,
    total: int,
    created_by: uuid.UUID | None,
    ref_id: uuid.UUID | None = None,
) -> Jobs:
    job = Jobs(
        org_id=org_id, kind=kind, total=total, ref_id=ref_id, created_by=created_by, progress=0
    )
    session.add(job)
    session.flush()
    return job


class JobTracker:
    """Moves a job through running -> done | failed and records progress."""

    def __init__(self, session: Session, job: Jobs) -> None:
        self._session = session
        self.job = job

    def start(self) -> None:
        self.job.status = JobStatus.RUNNING
        self.job.started_at = datetime.now(UTC)
        self._session.commit()

    def advance(self, steps: int = 1) -> None:
        self.job.progress = min(self.job.progress + steps, self.job.total)
        self._session.commit()

    def finish(self, result: dict[str, Any] | None = None) -> None:
        self.job.status = JobStatus.DONE
        self.job.result = result
        self.job.finished_at = datetime.now(UTC)
        self._session.commit()

    def fail(self, error: str) -> None:
        self._session.rollback()
        self.job.status = JobStatus.FAILED
        self.job.error = error[:1000]
        self.job.finished_at = datetime.now(UTC)
        self._session.commit()
