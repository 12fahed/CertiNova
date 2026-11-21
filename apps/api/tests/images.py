import io

from PIL import Image


def png(width: int, height: int, color: str = "white") -> bytes:
    out = io.BytesIO()
    Image.new("RGB", (width, height), color).save(out, "PNG")
    return out.getvalue()


def open_png(data: bytes) -> Image.Image:
    return Image.open(io.BytesIO(data)).convert("RGB")


def dark_pixels(image: Image.Image, box: tuple[int, int, int, int], threshold: int = 128) -> int:
    histogram = image.crop(box).convert("L").histogram()
    return sum(histogram[:threshold])
