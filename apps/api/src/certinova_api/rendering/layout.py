from dataclasses import asdict, dataclass
from typing import Any

from certinova_api.db.models import FieldKey


@dataclass(frozen=True)
class Box:
    x: float
    y: float
    width: float
    height: float

    def scaled(self, sx: float, sy: float) -> "Box":
        return Box(self.x * sx, self.y * sy, self.width * sx, self.height * sy)


@dataclass(frozen=True)
class FieldStyle:
    render_family: str
    bold: bool
    italic: bool
    underline: bool
    color: str


@dataclass(frozen=True)
class LayoutField:
    box: Box
    style: FieldStyle


@dataclass(frozen=True)
class TemplateLayout:
    """Everything needed to render a batch. Stored as batches.template_snapshot."""

    image_path: str
    image_width: int
    image_height: int
    organisation_name: str
    fields: dict[FieldKey, LayoutField]

    def to_snapshot(self) -> dict[str, Any]:
        return {
            "image_path": self.image_path,
            "image_width": self.image_width,
            "image_height": self.image_height,
            "organisation_name": self.organisation_name,
            "fields": {
                key.value: {"box": asdict(f.box), "style": asdict(f.style)}
                for key, f in self.fields.items()
            },
        }

    @classmethod
    def from_snapshot(cls, data: dict[str, Any]) -> "TemplateLayout":
        return cls(
            image_path=data["image_path"],
            image_width=int(data["image_width"]),
            image_height=int(data["image_height"]),
            organisation_name=data["organisation_name"],
            fields={
                FieldKey(key): LayoutField(Box(**f["box"]), FieldStyle(**f["style"]))
                for key, f in data["fields"].items()
            },
        )
