from certinova_api.db.models import FieldKey
from certinova_api.rendering.layout import Box, FieldStyle, LayoutField, TemplateLayout


def test_snapshot_round_trip() -> None:
    layout = TemplateLayout(
        image_path="org/template.png",
        image_width=2000,
        image_height=1414,
        organisation_name="Demo University",
        fields={
            FieldKey.RECIPIENT_NAME: LayoutField(
                Box(1, 2, 3, 4), FieldStyle("Great Vibes", True, False, True, "#123456")
            )
        },
    )

    assert TemplateLayout.from_snapshot(layout.to_snapshot()) == layout
