from collections.abc import Callable, Mapping
from dataclasses import dataclass, field
from typing import Any

from pydantic import BaseModel
from sqlalchemy.orm import Session

from certinova_api.hasura.payload import Caller
from certinova_api.services.container import Services

ActionResult = Mapping[str, Any] | None


@dataclass
class ActionContext:
    caller: Caller
    session: Session
    services: Services
    _after_commit: list[Callable[[], None]] = field(default_factory=list)

    def after_commit(self, callback: Callable[[], None]) -> None:
        """Run once the transaction has committed, e.g. to enqueue a job the worker will read."""
        self._after_commit.append(callback)

    def run_after_commit(self) -> None:
        for callback in self._after_commit:
            callback()


@dataclass(frozen=True)
class RegisteredAction:
    input_model: type[BaseModel]
    handler: Callable[[ActionContext, Any], ActionResult]


def action[InputT: BaseModel](
    name: str, input_model: type[InputT], handler: Callable[[ActionContext, InputT], ActionResult]
) -> tuple[str, RegisteredAction]:
    """One registry entry; keeps the input model and the handler argument type in step."""
    return name, RegisteredAction(input_model, handler)


class ActionRegistry:
    def __init__(self) -> None:
        self._actions: dict[str, RegisteredAction] = {}

    def register(self, entries: list[tuple[str, RegisteredAction]]) -> None:
        for name, entry in entries:
            if name in self._actions:
                raise ValueError(f"action {name} is already registered")
            self._actions[name] = entry

    def get(self, name: str) -> RegisteredAction | None:
        return self._actions.get(name)

    def names(self) -> set[str]:
        return set(self._actions)
