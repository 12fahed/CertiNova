import hmac
import logging
import time
from http import HTTPStatus

from flask import Blueprint, Response, current_app, jsonify, request
from pydantic import ValidationError

from certinova_api.hasura.errors import ActionError
from certinova_api.hasura.payload import ActionPayload, Caller
from certinova_api.hasura.registry import ActionContext, ActionRegistry
from certinova_api.log import log_fields
from certinova_api.services.container import Services

SECRET_HEADER = "X-Hasura-Action-Secret"
logger = logging.getLogger(__name__)


def _error(error: ActionError) -> tuple[Response, int]:
    return jsonify(error.to_response()), error.status


def _first_validation_message(exc: ValidationError) -> str:
    first = exc.errors()[0]
    location = ".".join(str(part) for part in first["loc"])
    return f"{location}: {first['msg']}" if location else str(first["msg"])


def create_actions_blueprint(registry: ActionRegistry) -> Blueprint:
    bp = Blueprint("actions", __name__, url_prefix="/actions")

    @bp.post("/<name>")
    def run_action(name: str) -> tuple[Response, int]:
        services: Services = current_app.extensions["certinova"]
        expected = services.settings.hasura_action_secret.get_secret_value().encode()
        given = request.headers.get(SECRET_HEADER, "").encode()
        if not hmac.compare_digest(given, expected):
            return _error(
                ActionError("unauthorized", "Bad action secret.", HTTPStatus.UNAUTHORIZED)
            )

        action = registry.get(name)
        if action is None:
            return _error(ActionError("unknown-action", f"No action {name}.", HTTPStatus.NOT_FOUND))

        try:
            payload = ActionPayload.model_validate(request.get_json(silent=True) or {})
            data = action.input_model.model_validate(payload.input)
        except ValidationError as exc:
            return _error(ActionError("invalid-input", _first_validation_message(exc)))
        if payload.action.name != name:
            return _error(ActionError("invalid-input", "Action name does not match the URL."))

        caller = Caller.from_payload(payload)
        started = time.perf_counter()
        fields = log_fields(action=name, role=caller.role, user_id=caller.user_id)
        try:
            with services.sessions.begin() as session:
                context = ActionContext(caller, session, services)
                result = action.handler(context, data)
            context.run_after_commit()
        except ActionError as error:
            logger.info("action refused: %s", error.code, extra=fields)
            return _error(error)
        except Exception:
            logger.exception("action failed", extra=fields)
            return _error(
                ActionError(
                    "internal-error", "Something went wrong.", HTTPStatus.INTERNAL_SERVER_ERROR
                )
            )

        fields["fields"]["duration_ms"] = round((time.perf_counter() - started) * 1000)
        logger.info("action done", extra=fields)
        return jsonify(result), HTTPStatus.OK

    return bp
