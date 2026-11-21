import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from certinova_api.db.models import (
    Fonts,
    FontStyle,
    FontWeight,
    TemplateFields,
    Templates,
    TextDecoration,
)
from certinova_api.hasura.errors import not_found
from certinova_api.rendering.layout import Box, FieldStyle, LayoutField, TemplateLayout


def build_layout(
    session: Session, template_id: uuid.UUID, organisation_name: str
) -> TemplateLayout:
    """Snapshot a template and its fields, with the font each renderer should use."""
    template = session.get(Templates, template_id)
    if template is None:
        raise not_found("Template")
    rows = session.execute(
        select(TemplateFields, Fonts.render_family)
        .join(Fonts, Fonts.family == TemplateFields.font_family)
        .where(TemplateFields.template_id == template_id)
    ).all()
    return TemplateLayout(
        image_path=template.image_path,
        image_width=template.image_width,
        image_height=template.image_height,
        organisation_name=organisation_name,
        fields={
            field.field_key: LayoutField(
                box=Box(float(field.x), float(field.y), float(field.width), float(field.height)),
                style=FieldStyle(
                    render_family=render_family,
                    bold=field.font_weight is FontWeight.BOLD,
                    italic=field.font_style is FontStyle.ITALIC,
                    underline=field.text_decoration is TextDecoration.UNDERLINE,
                    color=field.color,
                ),
            )
            for field, render_family in rows
        },
    )
