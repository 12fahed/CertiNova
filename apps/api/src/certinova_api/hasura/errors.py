from http import HTTPStatus


class ActionError(Exception):
    """An error Hasura returns to the client as {message, extensions: {code}}."""

    def __init__(self, code: str, message: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status

    def to_response(self) -> dict[str, object]:
        return {"message": self.message, "extensions": {"code": self.code}}


def unauthenticated() -> ActionError:
    return ActionError("unauthenticated", "Sign in to do this.", HTTPStatus.UNAUTHORIZED)


def forbidden(message: str = "You do not have permission to do this.") -> ActionError:
    return ActionError("forbidden", message, HTTPStatus.FORBIDDEN)


def not_found(what: str) -> ActionError:
    return ActionError("not-found", f"{what} not found.", HTTPStatus.NOT_FOUND)


def invalid(code: str, message: str) -> ActionError:
    return ActionError(code, message, HTTPStatus.BAD_REQUEST)


def conflict(code: str, message: str) -> ActionError:
    return ActionError(code, message, HTTPStatus.CONFLICT)
