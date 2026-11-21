import uuid
from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from certinova_api.hasura.errors import unauthenticated


class _SessionVariables(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    role: str = Field(alias="x-hasura-role")
    user_id: uuid.UUID | None = Field(default=None, alias="x-hasura-user-id")


class _ActionName(BaseModel):
    name: str


class ActionPayload(BaseModel):
    """The body Hasura sends to an action handler."""

    action: _ActionName
    input: dict[str, Any]
    session_variables: _SessionVariables


@dataclass(frozen=True)
class Caller:
    role: str
    user_id: uuid.UUID | None

    @classmethod
    def from_payload(cls, payload: ActionPayload) -> "Caller":
        return cls(payload.session_variables.role, payload.session_variables.user_id)

    def require_user(self) -> uuid.UUID:
        if self.role != "user" or self.user_id is None:
            raise unauthenticated()
        return self.user_id
