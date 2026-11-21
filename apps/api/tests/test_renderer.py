from pathlib import Path

from certinova_api.db.models import FieldKey
from certinova_api.rendering.fonts import FontResolver
from certinova_api.rendering.layout import Box, FieldStyle, LayoutField, TemplateLayout
from certinova_api.rendering.renderer import CertificateData, CertificateRenderer
from tests.images import dark_pixels, open_png, png

STYLE = FieldStyle("Inter", bold=False, italic=False, underline=False, color="#000000")
LAYOUT = TemplateLayout(
    image_path="org/t.png",
    image_width=800,
    image_height=600,
    organisation_name="Demo University",
    fields={
        FieldKey.RECIPIENT_NAME: LayoutField(Box(100, 100, 600, 100), STYLE),
        FieldKey.CERTIFICATE_QR: LayoutField(Box(600, 400, 150, 150), STYLE),
    },
)
DATA = CertificateData("cert-1", "Aarav Sharma", None, "https://certinova.test/verify/cert-1")


def renderer(tmp_path: Path) -> CertificateRenderer:
    return CertificateRenderer(FontResolver(tmp_path, source=None, system_dirs=()))


def test_draws_name_and_qr_inside_their_boxes(tmp_path: Path) -> None:
    image = open_png(renderer(tmp_path).render(png(800, 600), LAYOUT, DATA))

    assert image.size == (800, 600)
    assert dark_pixels(image, (100, 100, 700, 200)) > 200
    assert dark_pixels(image, (600, 400, 750, 550)) > 2000
    assert dark_pixels(image, (0, 250, 800, 380)) == 0


def test_scales_boxes_when_the_image_is_larger_than_the_layout(tmp_path: Path) -> None:
    image = open_png(renderer(tmp_path).render(png(1600, 1200), LAYOUT, DATA))

    assert dark_pixels(image, (200, 200, 1400, 400)) > 800
    assert dark_pixels(image, (0, 500, 1600, 760)) == 0


def test_skips_rank_when_the_recipient_has_none(tmp_path: Path) -> None:
    layout = TemplateLayout(
        LAYOUT.image_path,
        800,
        600,
        LAYOUT.organisation_name,
        {FieldKey.RANK: LayoutField(Box(100, 300, 600, 100), STYLE)},
    )

    image = open_png(renderer(tmp_path).render(png(800, 600), layout, DATA))

    assert dark_pixels(image, (0, 0, 800, 600)) == 0
