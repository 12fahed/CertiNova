import hashlib
import secrets

INVITE_TOKEN_BYTES = 32


def new_invite_token() -> tuple[str, str]:
    """Return (token to email, hash to store)."""
    token = secrets.token_urlsafe(INVITE_TOKEN_BYTES)
    return token, hash_token(token)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
