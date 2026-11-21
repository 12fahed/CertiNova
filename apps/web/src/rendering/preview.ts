import QRCode from 'qrcode'
import { cssFont, resolveFont, type ResolvedFont } from './fonts'
import { scaleBox, type Box, type FieldKey, type TemplateLayout, type TextFieldKey } from './layout'
import { fitText, MAX_FONT_SIZE } from './textFit'

const QR_SIZE_RATIO = 0.8
const QR_BORDER_MODULES = 1
const UNDERLINE_OFFSET = 2

export interface CertificateData {
  certificateId: string
  recipientName: string
  rank: string | null
  verifyUrl: string
}

export function verifyUrl(certificateId: string): string {
  return `${window.location.origin}/verify/${certificateId}`
}

/** Draws one certificate on the canvas, like the server renderer (rendering/renderer.py). */
export async function renderPreview(
  canvas: HTMLCanvasElement,
  background: HTMLImageElement,
  layout: TemplateLayout,
  data: CertificateData,
): Promise<void> {
  const entries = Object.entries(layout.fields) as [
    FieldKey,
    NonNullable<TemplateLayout['fields'][FieldKey]>,
  ][]
  const fonts = new Map<FieldKey, ResolvedFont>()
  await Promise.all(
    entries
      .filter(([key]) => key !== 'certificate_qr')
      .map(async ([key, field]) => fonts.set(key, await resolveFont(field.style))),
  )

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = background.naturalWidth
  canvas.height = background.naturalHeight
  const sx = background.naturalWidth / layout.imageWidth
  const sy = background.naturalHeight / layout.imageHeight
  ctx.drawImage(background, 0, 0)

  const texts: Record<TextFieldKey, string | null> = {
    recipient_name: data.recipientName,
    rank: data.rank,
    organisation_name: layout.organisationName,
    certificate_link: data.certificateId,
  }
  for (const [key, field] of entries) {
    const box = scaleBox(field.box, sx, sy)
    if (key === 'certificate_qr') {
      drawQr(ctx, box, data.verifyUrl)
      continue
    }
    const text = texts[key]
    const font = fonts.get(key)
    if (text && font) {
      drawText(
        ctx,
        text,
        box,
        font,
        field.style.color,
        field.style.underline,
        MAX_FONT_SIZE[key] * sx,
      )
    }
  }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: Box,
  font: ResolvedFont,
  color: string,
  underline: boolean,
  maxSize: number,
): void {
  const measure = (value: string, size: number) => {
    ctx.font = cssFont(font, size)
    const metrics = ctx.measureText(value)
    return { width: metrics.width, ascent: metrics.actualBoundingBoxAscent }
  }
  const fitted = fitText(text, box, maxSize, measure)
  ctx.font = cssFont(font, fitted.size)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = color
  ctx.fillText(text, fitted.x, fitted.baselineY)
  if (underline) {
    const y = fitted.baselineY + UNDERLINE_OFFSET
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(1, Math.round(fitted.size / 20))
    ctx.beginPath()
    ctx.moveTo(fitted.x, y)
    ctx.lineTo(fitted.x + fitted.width, y)
    ctx.stroke()
  }
}

function drawQr(ctx: CanvasRenderingContext2D, box: Box, url: string): void {
  const size = Math.round(Math.min(box.width, box.height) * QR_SIZE_RATIO)
  if (size <= 0) return
  const { modules } = QRCode.create(url, { errorCorrectionLevel: 'M' })
  const total = modules.size + QR_BORDER_MODULES * 2

  // One pixel per module, then scaled up with nearest-neighbour like the server.
  const qr = document.createElement('canvas')
  qr.width = total
  qr.height = total
  const qrCtx = qr.getContext('2d')
  if (!qrCtx) return
  qrCtx.fillStyle = '#fff'
  qrCtx.fillRect(0, 0, total, total)
  qrCtx.fillStyle = '#000'
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) {
        qrCtx.fillRect(col + QR_BORDER_MODULES, row + QR_BORDER_MODULES, 1, 1)
      }
    }
  }
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    qr,
    Math.round(box.x + (box.width - size) / 2),
    Math.round(box.y + (box.height - size) / 2),
    size,
    size,
  )
  ctx.imageSmoothingEnabled = true
}
