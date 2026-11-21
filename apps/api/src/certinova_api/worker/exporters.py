import io
import re
import zipfile
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


@dataclass(frozen=True)
class ExportFile:
    name: str
    png_path: Path


@dataclass(frozen=True)
class ExportFormatSpec:
    extension: str
    content_type: str


FORMATS = {
    "images_zip": ExportFormatSpec("zip", "application/zip"),
    "individual_pdfs": ExportFormatSpec("zip", "application/zip"),
    "combined_pdf": ExportFormatSpec("pdf", "application/pdf"),
}


def unique_file_names(names: Iterable[str]) -> list[str]:
    """Safe, unique base names: "Aarav Sharma", "Aarav Sharma (2)", ..."""
    seen: dict[str, int] = {}
    result = []
    for name in names:
        base = re.sub(r"[^\w\- ]+", "", name).strip() or "certificate"
        seen[base] = seen.get(base, 0) + 1
        result.append(base if seen[base] == 1 else f"{base} ({seen[base]})")
    return result


def _png_to_pdf(png_path: Path) -> bytes:
    out = io.BytesIO()
    with Image.open(png_path) as image:
        image.convert("RGB").save(out, "PDF", resolution=150)
    return out.getvalue()


def write_export(fmt: str, files: list[ExportFile], out_path: Path) -> None:
    if fmt == "images_zip":
        with zipfile.ZipFile(out_path, "w", zipfile.ZIP_STORED) as archive:
            for file in files:
                archive.write(file.png_path, f"{file.name}.png")
    elif fmt == "individual_pdfs":
        with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as archive:
            for file in files:
                archive.writestr(f"{file.name}.pdf", _png_to_pdf(file.png_path))
    elif fmt == "combined_pdf":
        pages = [Image.open(file.png_path).convert("RGB") for file in files]
        try:
            pages[0].save(out_path, "PDF", resolution=150, save_all=True, append_images=pages[1:])
        finally:
            for page in pages:
                page.close()
    else:
        raise ValueError(f"unknown export format {fmt}")
