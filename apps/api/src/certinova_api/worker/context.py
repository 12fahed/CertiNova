from dataclasses import dataclass
from functools import lru_cache

from certinova_api.config import get_settings
from certinova_api.rendering.fonts import FontResolver, GoogleFontsSource
from certinova_api.rendering.renderer import CertificateRenderer
from certinova_api.services.container import Services, build_services


@dataclass(frozen=True)
class WorkerContext:
    services: Services
    renderer: CertificateRenderer


def build_worker_context(services: Services) -> WorkerContext:
    settings = services.settings
    fonts = FontResolver(
        settings.fonts_dir, GoogleFontsSource() if settings.fonts_download else None
    )
    return WorkerContext(services=services, renderer=CertificateRenderer(fonts))


@lru_cache
def worker_context() -> WorkerContext:
    return build_worker_context(build_services(get_settings()))
