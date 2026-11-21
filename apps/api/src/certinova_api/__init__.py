from flask import Flask

from certinova_api.actions import build_registry
from certinova_api.config import Settings, get_settings
from certinova_api.hasura.blueprint import create_actions_blueprint
from certinova_api.health import bp as health_bp
from certinova_api.log import configure_logging
from certinova_api.services.container import Services, build_services


def create_app(settings: Settings | None = None, services: Services | None = None) -> Flask:
    settings = settings or (services.settings if services else get_settings())
    configure_logging(settings.log_level)

    app = Flask(__name__)
    app.config["APP_ENV"] = settings.app_env.value
    app.extensions["certinova"] = services or build_services(settings)
    app.register_blueprint(health_bp)
    app.register_blueprint(create_actions_blueprint(build_registry()))
    return app
