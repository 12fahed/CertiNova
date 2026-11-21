"""Bucket names and object keys. Keys start with the org id; the storage policies rely on it."""

import uuid

TEMPLATES_BUCKET = "templates"
CERTIFICATES_BUCKET = "certificates"
EXPORTS_BUCKET = "exports"


def certificate_key(org_id: uuid.UUID, batch_id: uuid.UUID, certificate_id: uuid.UUID) -> str:
    return f"{org_id}/{batch_id}/{certificate_id}.png"


def export_key(org_id: uuid.UUID, job_id: uuid.UUID, extension: str) -> str:
    return f"{org_id}/{job_id}.{extension}"


def verify_url(frontend_url: str, certificate_id: uuid.UUID) -> str:
    return f"{frontend_url.rstrip('/')}/verify/{certificate_id}"
