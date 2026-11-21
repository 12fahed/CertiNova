import json
from pathlib import Path

import pytest

from certinova_api.services.legacy_crypto import LegacyDecryptError, decrypt_recipients

# Made by certinova-backend/src/utils/crypto.js (encryptData), the real legacy code.
FIXTURE = json.loads((Path(__file__).parent / "fixtures" / "legacy_blob.json").read_text())


def _decrypt(password: str) -> list[object]:
    blob = FIXTURE["blob"]
    return list(decrypt_recipients(blob["encryptedData"], blob["salt"], blob["iv"], password))


def test_decrypts_data_made_by_the_legacy_api() -> None:
    recipients = decrypt_recipients(
        FIXTURE["blob"]["encryptedData"],
        FIXTURE["blob"]["salt"],
        FIXTURE["blob"]["iv"],
        FIXTURE["password"],
    )

    assert [(r.name, r.email, r.rank, r.uuid) for r in recipients] == [
        (row["name"], row.get("email"), row.get("rank"), row.get("uuid"))
        for row in FIXTURE["recipients"]
    ]


def test_wrong_password_raises() -> None:
    with pytest.raises(LegacyDecryptError):
        _decrypt("not-the-password")
