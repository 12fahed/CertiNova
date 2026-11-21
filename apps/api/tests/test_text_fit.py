import pytest

from certinova_api.db.models import FieldKey
from certinova_api.rendering.layout import Box
from certinova_api.rendering.text_fit import MAX_FONT_SIZE, fit_text


def fixed_width_measure(text: str, size: float) -> tuple[float, float]:
    return len(text) * size * 0.5, size * 0.7


def test_short_text_is_capped_by_max_size_and_centered() -> None:
    box = Box(100, 50, 1000, 200)

    fitted = fit_text("Ann", box, MAX_FONT_SIZE[FieldKey.RECIPIENT_NAME], fixed_width_measure)

    assert fitted.size == 100
    assert fitted.x + fitted.width / 2 == pytest.approx(box.x + box.width / 2)
    assert fitted.baseline_y == pytest.approx(box.y + (box.height + 70) / 2)


def test_wide_text_shrinks_to_ninety_percent_of_the_box() -> None:
    box = Box(0, 0, 300, 100)

    def wide(text: str, size: float) -> tuple[float, float]:
        return len(text) * size, size * 0.7

    fitted = fit_text("A long recipient name", box, 100, wide)

    assert fitted.width == pytest.approx(box.width * 0.9)


def test_start_size_never_goes_below_eight() -> None:
    box = Box(0, 0, 40, 100)

    sizes: list[float] = []

    def measure(text: str, size: float) -> tuple[float, float]:
        sizes.append(size)
        return 1.0, size * 0.7

    fit_text("x" * 200, box, 100, measure)

    assert sizes[0] == 8
