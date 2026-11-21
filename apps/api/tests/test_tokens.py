from certinova_api.services.tokens import hash_token, new_invite_token


def test_token_hash_is_stable_and_tokens_are_unique() -> None:
    token, token_hash = new_invite_token()
    other, _ = new_invite_token()

    assert hash_token(token) == token_hash
    assert token != other
    assert len(token) >= 40
