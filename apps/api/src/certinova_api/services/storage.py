from typing import Protocol
from urllib.parse import quote

import httpx


class Storage(Protocol):
    def download(self, bucket: str, path: str) -> bytes: ...

    def upload(self, bucket: str, path: str, data: bytes, content_type: str) -> None: ...

    def signed_url(self, bucket: str, path: str, expires_in: int) -> str: ...


class StorageError(RuntimeError):
    pass


class SupabaseStorage:
    """Supabase Storage REST API, called with the service role key."""

    def __init__(self, supabase_url: str, service_key: str, timeout: float = 30) -> None:
        self._base = f"{supabase_url.rstrip('/')}/storage/v1"
        headers = {"apikey": service_key}
        # Legacy service_role keys are JWTs; new sb_secret_ keys go in apikey only.
        if service_key.startswith("eyJ"):
            headers["Authorization"] = f"Bearer {service_key}"
        self._http = httpx.Client(headers=headers, timeout=timeout)

    def download(self, bucket: str, path: str) -> bytes:
        response = self._http.get(f"{self._base}/object/{bucket}/{quote(path)}")
        self._raise_for_status(response, f"download {bucket}/{path}")
        return response.content

    def upload(self, bucket: str, path: str, data: bytes, content_type: str) -> None:
        response = self._http.post(
            f"{self._base}/object/{bucket}/{quote(path)}",
            content=data,
            headers={"Content-Type": content_type, "x-upsert": "true"},
        )
        self._raise_for_status(response, f"upload {bucket}/{path}")

    def signed_url(self, bucket: str, path: str, expires_in: int) -> str:
        response = self._http.post(
            f"{self._base}/object/sign/{bucket}/{quote(path)}", json={"expiresIn": expires_in}
        )
        self._raise_for_status(response, f"sign {bucket}/{path}")
        signed_path: str = response.json()["signedURL"]
        return f"{self._base}{signed_path}"

    def close(self) -> None:
        self._http.close()

    @staticmethod
    def _raise_for_status(response: httpx.Response, operation: str) -> None:
        if response.is_error:
            raise StorageError(f"{operation} failed: {response.status_code} {response.text[:200]}")
