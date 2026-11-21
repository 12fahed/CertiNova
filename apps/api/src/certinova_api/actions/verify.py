import uuid
from datetime import UTC, datetime, timedelta

from pydantic import BaseModel
from sqlalchemy import select

from certinova_api.db.models import Certificates, Organizations
from certinova_api.hasura.registry import ActionContext, ActionResult, RegisteredAction, action
from certinova_api.services.paths import CERTIFICATES_BUCKET


class CertificateInput(BaseModel):
    certificate_id: uuid.UUID


def get_verify_preview_url(ctx: ActionContext, data: CertificateInput) -> ActionResult:
    """Public. Returns null when there is no image, or when the image would show a hidden name."""
    row = ctx.session.execute(
        select(Certificates.file_path, Organizations.show_name_on_verify)
        .join(Organizations, Organizations.id == Certificates.org_id)
        .where(Certificates.id == data.certificate_id)
    ).one_or_none()
    if row is None or row.file_path is None or not row.show_name_on_verify:
        return None

    ttl = ctx.services.settings.signed_url_ttl_seconds
    return {
        "url": ctx.services.storage.signed_url(CERTIFICATES_BUCKET, row.file_path, ttl),
        "expires_at": (datetime.now(UTC) + timedelta(seconds=ttl)).isoformat(),
    }


ACTIONS: list[tuple[str, RegisteredAction]] = [
    action("get_verify_preview_url", CertificateInput, get_verify_preview_url),
]
