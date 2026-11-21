import os
import uuid
from collections.abc import Iterator

import httpx
import pytest

from certinova_api.services.storage import StorageError, SupabaseStorage
from tests.images import png

pytestmark = pytest.mark.integration

KEY_VARS = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"]


@pytest.fixture(params=KEY_VARS)
def storage(request: pytest.FixtureRequest) -> Iterator[SupabaseStorage]:
    key = os.environ.get(request.param)
    if not key:
        pytest.skip(f"{request.param} is not set")
    client = SupabaseStorage(os.environ.get("SUPABASE_URL", "http://127.0.0.1:54321"), key)
    yield client
    client.close()


def test_upload_download_and_sign(storage: SupabaseStorage) -> None:
    path = f"{uuid.uuid4()}/storage-test.png"
    data = png(10, 10)

    storage.upload("certificates", path, data, "image/png")
    assert storage.download("certificates", path) == data

    signed = storage.signed_url("certificates", path, 60)
    with httpx.Client() as http:
        assert http.get(signed).content == data


def test_missing_object_raises(storage: SupabaseStorage) -> None:
    with pytest.raises(StorageError, match="download"):
        storage.download("certificates", f"{uuid.uuid4()}/missing.png")
