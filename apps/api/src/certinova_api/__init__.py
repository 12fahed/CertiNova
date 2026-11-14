from flask import Flask

from certinova_api.config import Settings, get_settings
from certinova_api.health import bp as health_bp


def create_app(settings: Settings | None = None) -> Flask:
    settings = settings or get_settings()

    app = Flask(__name__)
    app.config["APP_ENV"] = settings.app_env.value
    app.register_blueprint(health_bp)
    return app
