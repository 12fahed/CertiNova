"""RQ entry points. Each one loads the job by id; the job row holds everything else."""

import uuid

from certinova_api.worker.context import worker_context
from certinova_api.worker.email import SendBatchEmailsTask
from certinova_api.worker.export import ExportBatchTask
from certinova_api.worker.render import RenderBatchTask


def render_batch(job_id: str) -> None:
    RenderBatchTask(worker_context()).run(uuid.UUID(job_id))


def export_batch(job_id: str) -> None:
    ExportBatchTask(worker_context()).run(uuid.UUID(job_id))


def send_batch_emails(job_id: str) -> None:
    SendBatchEmailsTask(worker_context()).run(uuid.UUID(job_id))
