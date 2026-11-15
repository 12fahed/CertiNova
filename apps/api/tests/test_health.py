from certinova_api import create_app
from certinova_api.config import AppEnv, Settings


def test_health_reports_status_and_env() -> None:
    client = create_app(Settings(app_env=AppEnv.TEST)).test_client()

    response = client.get("/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok", "env": "test"}
