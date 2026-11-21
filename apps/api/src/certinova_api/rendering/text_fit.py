"""Text sizing shared by the server renderer and the browser preview.

The browser preview (apps/web) must implement the same steps. See docs/revamp/rendering.md.
"""

from collections.abc import Callable
from dataclasses import dataclass

from certinova_api.db.models import FieldKey
from certinova_api.rendering.layout import Box

MAX_FONT_SIZE: dict[FieldKey, float] = {
    FieldKey.RECIPIENT_NAME: 100,
    FieldKey.RANK: 150,
    FieldKey.ORGANISATION_NAME: 72,
    FieldKey.CERTIFICATE_LINK: 24,
}
MIN_START_SIZE = 8
AVG_CHAR_WIDTH = 0.6
MAX_WIDTH_RATIO = 0.9
MAX_HEIGHT_RATIO = 0.8

# (text, font size) -> (advance width, ascent above the baseline)
Measure = Callable[[str, float], tuple[float, float]]


@dataclass(frozen=True)
class FittedText:
    size: float
    x: float
    baseline_y: float
    width: float


def fit_text(text: str, box: Box, max_size: float, measure: Measure) -> FittedText:
    size = min(box.width / (len(text) * AVG_CHAR_WIDTH), box.height * MAX_HEIGHT_RATIO, max_size)
    size = max(size, MIN_START_SIZE)

    width, ascent = measure(text, size)
    max_width = box.width * MAX_WIDTH_RATIO
    max_height = box.height * MAX_HEIGHT_RATIO
    if width > max_width or size > max_height:
        size *= min(max_width / width, max_height / size)
        width, ascent = measure(text, size)

    return FittedText(
        size=size,
        x=box.x + (box.width - width) / 2,
        baseline_y=box.y + (box.height + ascent) / 2,
        width=width,
    )
