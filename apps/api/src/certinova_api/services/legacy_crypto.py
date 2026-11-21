"""Decrypts recipient lists encrypted by the legacy Express API.

Source of the format: certinova-backend/src/utils/crypto.js
"""

import hashlib
import json
from dataclasses import dataclass
from typing import Any

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

PBKDF2_ITERATIONS = 10_000
KEY_BYTES = 32


class LegacyDecryptError(ValueError):
    pass


@dataclass(frozen=True)
class LegacyRecipient:
    name: str
    email: str | None
    rank: str | None
    uuid: str | None


def decrypt_recipients(
    encrypted_hex: str, salt: str, iv_hex: str, password: str
) -> list[LegacyRecipient]:
    # The legacy code passed the hex salt string itself (not its bytes) to pbkdf2Sync.
    key = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), PBKDF2_ITERATIONS, KEY_BYTES
    )
    try:
        decryptor = Cipher(algorithms.AES(key), modes.CBC(bytes.fromhex(iv_hex))).decryptor()
        padded = decryptor.update(bytes.fromhex(encrypted_hex)) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        plain = unpadder.update(padded) + unpadder.finalize()
        rows: list[dict[str, Any]] = json.loads(plain.decode())
    except (ValueError, UnicodeDecodeError) as exc:
        raise LegacyDecryptError("wrong password or damaged data") from exc
    return [
        LegacyRecipient(
            name=str(row["name"]),
            email=row.get("email") or None,
            rank=row.get("rank") or None,
            uuid=row.get("uuid") or None,
        )
        for row in rows
    ]
