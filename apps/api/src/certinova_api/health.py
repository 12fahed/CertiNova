from flask import Blueprint, current_app

bp = Blueprint("health", __name__)


@bp.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "env": current_app.config["APP_ENV"]}
