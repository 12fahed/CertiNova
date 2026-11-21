import uuid
from datetime import UTC, datetime, timedelta
from typing import Literal

from pydantic import BaseModel
from sqlalchemy import func, select

from certinova_api.db.models import (
    Batches,
    BatchStatus,
    Certificates,
    DeliveryStatus,
    EmailDeliveries,
    JobKind,
    Jobs,
    JobStatus,
    Organizations,
    RenderStatus,
)
from certinova_api.hasura.errors import forbidden, invalid, not_found
from certinova_api.hasura.registry import ActionContext, ActionResult, RegisteredAction, action
from certinova_api.services.access import require_org_role
from certinova_api.services.jobs import create_job
from certinova_api.services.paths import EXPORTS_BUCKET
from certinova_api.services.templates import build_layout

EMAIL_FEATURE = "email-certificates"
ExportFormat = Literal["images_zip", "combined_pdf", "individual_pdfs"]


class BatchInput(BaseModel):
    batch_id: uuid.UUID


class ExportBatchInput(BaseModel):
    batch_id: uuid.UUID
    format: ExportFormat


class JobInput(BaseModel):
    job_id: uuid.UUID


def _load_batch(ctx: ActionContext, batch_id: uuid.UUID) -> tuple[Batches, uuid.UUID]:
    user_id = ctx.caller.require_user()
    batch = ctx.session.get(Batches, batch_id, with_for_update=True)
    if batch is None:
        raise not_found("Batch")
    require_org_role(ctx.session, batch.org_id, user_id)
    return batch, user_id


def _enqueue_after_commit(ctx: ActionContext, task: str, job: Jobs) -> ActionResult:
    job_id = job.id
    ctx.after_commit(lambda: ctx.services.queue.enqueue(task, job_id))
    return {"job_id": str(job_id)}


def start_batch_render(ctx: ActionContext, data: BatchInput) -> ActionResult:
    batch, user_id = _load_batch(ctx, data.batch_id)
    if batch.status is not BatchStatus.DRAFT:
        raise invalid("batch-not-draft", "This batch was already started.")

    count, with_rank = ctx.session.execute(
        select(func.count(), func.count(Certificates.rank)).where(Certificates.batch_id == batch.id)
    ).one()
    if count == 0:
        raise invalid("batch-empty", "Add at least one recipient first.")

    org = ctx.session.get(Organizations, batch.org_id)
    if org is None:
        raise not_found("Organization")
    batch.template_snapshot = build_layout(ctx.session, batch.template_id, org.name).to_snapshot()
    batch.status = BatchStatus.QUEUED
    batch.recipient_count = count
    batch.has_rank = with_rank > 0

    job = create_job(
        ctx.session,
        org_id=batch.org_id,
        kind=JobKind.RENDER,
        total=count,
        created_by=user_id,
        ref_id=batch.id,
    )
    return _enqueue_after_commit(ctx, "render_batch", job)


def export_batch(ctx: ActionContext, data: ExportBatchInput) -> ActionResult:
    batch, user_id = _load_batch(ctx, data.batch_id)
    if batch.status is not BatchStatus.READY:
        raise invalid("batch-not-ready", "Render the batch before you export it.")

    rendered = ctx.session.scalar(
        select(func.count()).where(
            Certificates.batch_id == batch.id, Certificates.file_path.is_not(None)
        )
    )
    job = create_job(
        ctx.session,
        org_id=batch.org_id,
        kind=JobKind.EXPORT,
        total=rendered or 0,
        created_by=user_id,
        ref_id=batch.id,
    )
    job.result = {"format": data.format}
    return _enqueue_after_commit(ctx, "export_batch", job)


def send_batch_emails(ctx: ActionContext, data: BatchInput) -> ActionResult:
    batch, user_id = _load_batch(ctx, data.batch_id)
    if not ctx.session.scalar(select(func.public.feature_enabled(EMAIL_FEATURE, batch.org_id))):
        raise forbidden("Email sending is not turned on for your organisation.")
    if batch.status is not BatchStatus.READY:
        raise invalid("batch-not-ready", "Render the batch before you send it.")

    already_sent = select(EmailDeliveries.certificate_id).where(
        EmailDeliveries.status.in_([DeliveryStatus.SENT, DeliveryStatus.QUEUED])
    )
    certificates = ctx.session.scalars(
        select(Certificates).where(
            Certificates.batch_id == batch.id,
            Certificates.recipient_email.is_not(None),
            Certificates.revoked_at.is_(None),
            Certificates.render_status == RenderStatus.DONE,
            Certificates.id.not_in(already_sent),
        )
    ).all()
    if not certificates:
        raise invalid(
            "nothing-to-send", "No rendered certificates with an email address are left to send."
        )

    for certificate in certificates:
        ctx.session.add(
            EmailDeliveries(
                org_id=batch.org_id,
                certificate_id=certificate.id,
                email=certificate.recipient_email,
            )
        )
    job = create_job(
        ctx.session,
        org_id=batch.org_id,
        kind=JobKind.EMAIL,
        total=len(certificates),
        created_by=user_id,
        ref_id=batch.id,
    )
    return _enqueue_after_commit(ctx, "send_batch_emails", job)


def get_export_url(ctx: ActionContext, data: JobInput) -> ActionResult:
    user_id = ctx.caller.require_user()
    job = ctx.session.get(Jobs, data.job_id)
    if job is None or job.kind is not JobKind.EXPORT:
        raise not_found("Export")
    require_org_role(ctx.session, job.org_id, user_id)
    path = job.result.get("path") if isinstance(job.result, dict) else None
    if job.status is not JobStatus.DONE or not isinstance(path, str):
        raise invalid("export-not-ready", "The export is not ready yet.")

    ttl = ctx.services.settings.signed_url_ttl_seconds
    return {
        "url": ctx.services.storage.signed_url(EXPORTS_BUCKET, path, ttl),
        "expires_at": (datetime.now(UTC) + timedelta(seconds=ttl)).isoformat(),
    }


ACTIONS: list[tuple[str, RegisteredAction]] = [
    action("start_batch_render", BatchInput, start_batch_render),
    action("export_batch", ExportBatchInput, export_batch),
    action("send_batch_emails", BatchInput, send_batch_emails),
    action("get_export_url", JobInput, get_export_url),
]
