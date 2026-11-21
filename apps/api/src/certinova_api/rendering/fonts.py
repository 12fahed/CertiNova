import logging
import re
from pathlib import Path
from typing import Protocol

import httpx
from PIL import ImageFont

from certinova_api.log import log_fields

logger = logging.getLogger(__name__)

FontObject = ImageFont.FreeTypeFont | ImageFont.ImageFont

# Open, metric-compatible fonts from Debian packages fonts-liberation2 and fonts-dejavu-core.
SYSTEM_FONT_DIRS = (Path("/usr/share/fonts/truetype"), Path("/usr/share/fonts"))
SYSTEM_FONT_FILES: dict[str, tuple[str, str, str, str]] = {
    # family: (regular, bold, italic, bold italic)
    "Liberation Sans": (
        "LiberationSans-Regular.ttf",
        "LiberationSans-Bold.ttf",
        "LiberationSans-Italic.ttf",
        "LiberationSans-BoldItalic.ttf",
    ),
    "Liberation Serif": (
        "LiberationSerif-Regular.ttf",
        "LiberationSerif-Bold.ttf",
        "LiberationSerif-Italic.ttf",
        "LiberationSerif-BoldItalic.ttf",
    ),
    "DejaVu Sans": (
        "DejaVuSans.ttf",
        "DejaVuSans-Bold.ttf",
        "DejaVuSans-Oblique.ttf",
        "DejaVuSans-BoldOblique.ttf",
    ),
    "DejaVu Sans Mono": (
        "DejaVuSansMono.ttf",
        "DejaVuSansMono-Bold.ttf",
        "DejaVuSansMono-Oblique.ttf",
        "DejaVuSansMono-BoldOblique.ttf",
    ),
}

_TTF_URL = re.compile(r"url\((https://fonts\.gstatic\.com/[^)]+\.ttf)\)")


class FontSource(Protocol):
    def fetch(self, family: str, bold: bool, italic: bool) -> bytes | None: ...


class GoogleFontsSource:
    """Static TTF files from the Google Fonts CSS API.

    The API serves TTF (not WOFF2) to clients without a browser user agent.
    """

    def __init__(self, http: httpx.Client | None = None) -> None:
        self._http = http or httpx.Client(timeout=15, headers={"User-Agent": "certinova-renderer"})

    def fetch(self, family: str, bold: bool, italic: bool) -> bytes | None:
        # Pass spaces as-is: httpx encodes them; a pre-encoded "+" becomes %2B and fails.
        axis = f"{family}:ital,wght@{int(italic)},{700 if bold else 400}"
        css = self._http.get("https://fonts.googleapis.com/css2", params={"family": axis})
        if css.is_error:
            return None
        match = _TTF_URL.search(css.text)
        if not match:
            return None
        font = self._http.get(match.group(1))
        return None if font.is_error else font.content


class FontResolver:
    """Finds the file for a font variant: system fonts, then the cache, then a download."""

    def __init__(
        self,
        cache_dir: Path,
        source: FontSource | None,
        system_dirs: tuple[Path, ...] = SYSTEM_FONT_DIRS,
    ) -> None:
        self._cache_dir = cache_dir
        self._source = source
        self._system_dirs = system_dirs
        self._missing: set[tuple[str, bool, bool]] = set()
        self._found: dict[tuple[str, bool, bool], Path] = {}

    def load(self, family: str, size: float, bold: bool, italic: bool) -> FontObject:
        for want_bold, want_italic in dict.fromkeys(((bold, italic), (False, False))):
            path = self.path_for(family, want_bold, want_italic)
            if path is not None:
                return ImageFont.truetype(str(path), size)
        logger.warning("font not found, using fallback", extra=log_fields(family=family))
        return ImageFont.load_default(size)

    def path_for(self, family: str, bold: bool, italic: bool) -> Path | None:
        key = (family, bold, italic)
        if key in self._found:
            return self._found[key]
        if key in self._missing:
            return None
        path = self._locate(family, bold, italic)
        if path is None:
            self._missing.add(key)
        else:
            self._found[key] = path
        return path

    def _locate(self, family: str, bold: bool, italic: bool) -> Path | None:
        system = self._system_path(family, bold, italic)
        if system is not None:
            return system

        cached = self._cache_dir / _slug(family) / f"{700 if bold else 400}-{int(italic)}.ttf"
        if cached.is_file():
            return cached
        if self._source is None:
            return None

        data = self._source.fetch(family, bold, italic)
        if data is None:
            return None
        cached.parent.mkdir(parents=True, exist_ok=True)
        cached.write_bytes(data)
        return cached

    def _system_path(self, family: str, bold: bool, italic: bool) -> Path | None:
        files = SYSTEM_FONT_FILES.get(family)
        if files is None:
            return None
        name = files[int(bold) + 2 * int(italic)]
        for root in self._system_dirs:
            matches = sorted(root.rglob(name)) if root.is_dir() else []
            if matches:
                return matches[0]
        return None


def _slug(family: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", family.lower()).strip("-")
