import io
from pathlib import Path

import httpx
from PIL import ImageFont

from certinova_api.rendering.fonts import FontResolver, GoogleFontsSource


def _pillow_default_font() -> bytes:
    font = ImageFont.load_default(10)
    assert isinstance(font, ImageFont.FreeTypeFont) and isinstance(font.path, io.BytesIO)
    return font.path.getvalue()


TTF_BYTES = _pillow_default_font()


class CountingSource:
    def __init__(self, available: set[tuple[str, bool, bool]]) -> None:
        self.available = available
        self.calls: list[tuple[str, bool, bool]] = []

    def fetch(self, family: str, bold: bool, italic: bool) -> bytes | None:
        self.calls.append((family, bold, italic))
        return TTF_BYTES if (family, bold, italic) in self.available else None


def test_downloads_once_and_caches_on_disk(tmp_path: Path) -> None:
    source = CountingSource({("Great Vibes", False, False)})
    resolver = FontResolver(tmp_path, source, system_dirs=())

    first = resolver.path_for("Great Vibes", False, False)
    second = FontResolver(tmp_path, source, system_dirs=()).path_for("Great Vibes", False, False)

    assert first == second == tmp_path / "great-vibes" / "400-0.ttf"
    assert source.calls == [("Great Vibes", False, False)]


def test_missing_bold_falls_back_to_regular(tmp_path: Path) -> None:
    resolver = FontResolver(tmp_path, CountingSource({("Pacifico", False, False)}), system_dirs=())

    font = resolver.load("Pacifico", 40, bold=True, italic=False)

    assert isinstance(font, ImageFont.FreeTypeFont) and isinstance(font.path, str)
    assert Path(font.path) == tmp_path / "pacifico" / "400-0.ttf"


def test_unknown_font_uses_the_default_font(tmp_path: Path) -> None:
    resolver = FontResolver(tmp_path, source=None, system_dirs=())

    font = resolver.load("No Such Font", 40, bold=False, italic=False)

    assert isinstance(font, ImageFont.FreeTypeFont)
    assert font.size == 40


def test_system_fonts_are_found_by_file_name(tmp_path: Path) -> None:
    system = tmp_path / "system" / "liberation2"
    system.mkdir(parents=True)
    (system / "LiberationSans-Bold.ttf").write_bytes(TTF_BYTES)
    resolver = FontResolver(tmp_path / "cache", None, system_dirs=(tmp_path / "system",))

    assert resolver.path_for("Liberation Sans", True, False) == system / "LiberationSans-Bold.ttf"
    assert resolver.path_for("Liberation Sans", False, False) is None


def test_google_fonts_request_keeps_spaces_in_the_family() -> None:
    seen: list[str] = []
    css = "src: url(https://fonts.gstatic.com/s/greatvibes/v1/GreatVibes.ttf) format('truetype');"

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request.url.params.get("family", "") if request.url.path == "/css2" else "")
        if request.url.host == "fonts.googleapis.com":
            return httpx.Response(200, text=css)
        return httpx.Response(200, content=b"ttf-bytes")

    source = GoogleFontsSource(httpx.Client(transport=httpx.MockTransport(handler)))

    assert source.fetch("Great Vibes", bold=False, italic=False) == b"ttf-bytes"
    assert seen[0] == "Great Vibes:ital,wght@0,400"


def test_google_fonts_missing_variant_returns_none() -> None:
    source = GoogleFontsSource(
        httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(400)))
    )

    assert source.fetch("Great Vibes", bold=True, italic=False) is None
