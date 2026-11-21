import type { TemplateField } from '@/rendering/layout'
import { BUCKETS, supabase } from '@/lib/supabase'
import type { Size } from './geometry'

// Same limits as the templates storage bucket.
const MAX_BYTES = 10 * 1024 * 1024
const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

export function imageProblem(file: File): string | null {
  if (!(file.type in EXTENSIONS)) return 'Use a PNG, JPEG or WebP image.'
  if (file.size > MAX_BYTES) return 'The image must be 10 MB or smaller.'
  return null
}

export function readImageSize(url: string): Promise<Size> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new Error('Cannot read this image.'))
    image.src = url
  })
}

/** Uploads to <org_id>/<uuid>.<ext>. A new name each time, so batches keep their old image. */
export async function uploadTemplateImage(orgId: string, file: File): Promise<string> {
  const path = `${orgId}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`
  const { error } = await supabase.storage
    .from(BUCKETS.templates)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  return path
}

/** Keeps each box at the same relative place when the image size changes. */
export function scaleFields(
  fields: readonly TemplateField[],
  from: Size,
  to: Size,
): TemplateField[] {
  const sx = to.width / from.width
  const sy = to.height / from.height
  return fields.map((field) => ({
    ...field,
    x: field.x * sx,
    y: field.y * sy,
    width: field.width * sx,
    height: field.height * sy,
  }))
}
