import io
from dataclasses import dataclass

import qrcode
from PIL import Image, ImageDraw

from certinova_api.db.models import FieldKey
from certinova_api.rendering.fonts import FontResolver
from certinova_api.rendering.layout import Box, LayoutField, TemplateLayout
from certinova_api.rendering.text_fit import MAX_FONT_SIZE, fit_text

QR_SIZE_RATIO = 0.8
UNDERLINE_OFFSET = 2


@dataclass(frozen=True)
class CertificateData:
    certificate_id: str
    recipient_name: str
    rank: str | None
    verify_url: str


class CertificateRenderer:
    def __init__(self, fonts: FontResolver) -> None:
        self._fonts = fonts

    def render(self, background: bytes, layout: TemplateLayout, data: CertificateData) -> bytes:
        image = Image.open(io.BytesIO(background)).convert("RGB")
        sx = image.width / layout.image_width
        sy = image.height / layout.image_height
        draw = ImageDraw.Draw(image)

        texts = {
            FieldKey.RECIPIENT_NAME: data.recipient_name,
            FieldKey.RANK: data.rank,
            FieldKey.ORGANISATION_NAME: layout.organisation_name,
            FieldKey.CERTIFICATE_LINK: data.certificate_id,
        }
        for key, field in layout.fields.items():
            box = field.box.scaled(sx, sy)
            if key is FieldKey.CERTIFICATE_QR:
                self._draw_qr(image, box, data.verify_url)
                continue
            text = texts.get(key)
            if text:
                self._draw_text(draw, text, box, field, MAX_FONT_SIZE[key] * sx)

        out = io.BytesIO()
        image.save(out, "PNG", optimize=True)
        return out.getvalue()

    def _draw_text(
        self, draw: ImageDraw.ImageDraw, text: str, box: Box, field: LayoutField, max_size: float
    ) -> None:
        style = field.style

        def measure(value: str, size: float) -> tuple[float, float]:
            font = self._fonts.load(style.render_family, size, style.bold, style.italic)
            _, top, _, _ = font.getbbox(value, anchor="ls")
            return float(font.getlength(value)), float(-top)

        fitted = fit_text(text, box, max_size, measure)
        font = self._fonts.load(style.render_family, fitted.size, style.bold, style.italic)
        draw.text((fitted.x, fitted.baseline_y), text, font=font, fill=style.color, anchor="ls")
        if style.underline:
            y = fitted.baseline_y + UNDERLINE_OFFSET
            draw.line(
                [(fitted.x, y), (fitted.x + fitted.width, y)],
                fill=style.color,
                width=max(1, round(fitted.size / 20)),
            )

    @staticmethod
    def _draw_qr(image: Image.Image, box: Box, url: str) -> None:
        size = round(min(box.width, box.height) * QR_SIZE_RATIO)
        if size <= 0:
            return
        qr = qrcode.QRCode(border=1)
        qr.add_data(url)
        qr_image = qr.make_image(fill_color="black", back_color="white").get_image()
        qr_image = qr_image.convert("RGB").resize((size, size), Image.Resampling.NEAREST)
        image.paste(
            qr_image,
            (round(box.x + (box.width - size) / 2), round(box.y + (box.height - size) / 2)),
        )
