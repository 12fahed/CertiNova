import re
import zipfile
from pathlib import Path

import pytest

from certinova_api.worker.exporters import ExportFile, unique_file_names, write_export
from tests.images import png


@pytest.fixture
def files(tmp_path: Path) -> list[ExportFile]:
    result = []
    for index, name in enumerate(["Aarav", "Diya", "Kabir"]):
        path = tmp_path / f"{index}.png"
        path.write_bytes(png(200, 100))
        result.append(ExportFile(name, path))
    return result


def test_unique_file_names_are_safe_and_distinct() -> None:
    assert unique_file_names(["Aarav Sharma", "Aarav Sharma", "../etc/passwd", "***"]) == [
        "Aarav Sharma",
        "Aarav Sharma (2)",
        "etcpasswd",
        "certificate",
    ]


def test_images_zip(tmp_path: Path, files: list[ExportFile]) -> None:
    out = tmp_path / "out.zip"
    write_export("images_zip", files, out)

    assert zipfile.ZipFile(out).namelist() == ["Aarav.png", "Diya.png", "Kabir.png"]


def test_individual_pdfs(tmp_path: Path, files: list[ExportFile]) -> None:
    out = tmp_path / "out.zip"
    write_export("individual_pdfs", files, out)

    archive = zipfile.ZipFile(out)
    assert archive.namelist() == ["Aarav.pdf", "Diya.pdf", "Kabir.pdf"]
    assert archive.read("Aarav.pdf").startswith(b"%PDF")


def test_combined_pdf_has_one_page_per_certificate(tmp_path: Path, files: list[ExportFile]) -> None:
    out = tmp_path / "out.pdf"
    write_export("combined_pdf", files, out)

    pages = re.findall(rb"/Type\s*/Page(?!s)", out.read_bytes())
    assert len(pages) == 3
