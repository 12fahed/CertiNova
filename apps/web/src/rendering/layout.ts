import type { Database } from '@/types/database'

type Enums = Database['public']['Enums']
export type FieldKey = Enums['field_key']
export type TextFieldKey = Exclude<FieldKey, 'certificate_qr'>

export const FIELD_KEYS: readonly FieldKey[] = [
  'recipient_name',
  'organisation_name',
  'rank',
  'certificate_link',
  'certificate_qr',
]

export const FIELD_LABELS: Record<FieldKey, string> = {
  recipient_name: 'Recipient name',
  organisation_name: 'Organisation name',
  rank: 'Rank',
  certificate_link: 'Certificate ID',
  certificate_qr: 'QR code',
}

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

/** One row of template_fields, as the editor keeps it. Boxes are in natural image pixels. */
export interface TemplateField extends Box {
  field_key: FieldKey
  font_family: string
  font_weight: Enums['font_weight']
  font_style: Enums['font_style']
  text_decoration: Enums['text_decoration']
  color: string
}

export interface FieldStyle {
  renderFamily: string
  bold: boolean
  italic: boolean
  underline: boolean
  color: string
}

export interface LayoutField {
  box: Box
  style: FieldStyle
}

export interface TemplateLayout {
  imageWidth: number
  imageHeight: number
  organisationName: string
  fields: Partial<Record<FieldKey, LayoutField>>
}

export function scaleBox(box: Box, sx: number, sy: number): Box {
  return { x: box.x * sx, y: box.y * sy, width: box.width * sx, height: box.height * sy }
}

/** Same mapping as build_layout in apps/api services/templates.py. */
export function buildLayout(
  image: { width: number; height: number },
  organisationName: string,
  fields: readonly TemplateField[],
  renderFamilies: ReadonlyMap<string, string>,
): TemplateLayout {
  const layout: TemplateLayout = {
    imageWidth: image.width,
    imageHeight: image.height,
    organisationName,
    fields: {},
  }
  for (const field of fields) {
    layout.fields[field.field_key] = {
      box: { x: field.x, y: field.y, width: field.width, height: field.height },
      style: {
        renderFamily: renderFamilies.get(field.font_family) ?? field.font_family,
        bold: field.font_weight === 'bold',
        italic: field.font_style === 'italic',
        underline: field.text_decoration === 'underline',
        color: field.color,
      },
    }
  }
  return layout
}
