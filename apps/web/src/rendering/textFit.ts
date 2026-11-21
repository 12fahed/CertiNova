/**
 * Text sizing shared with the server renderer (apps/api rendering/text_fit.py).
 * Keep both in step with docs/revamp/rendering.md.
 */
import type { Box, TextFieldKey } from './layout'

export const MAX_FONT_SIZE: Record<TextFieldKey, number> = {
  recipient_name: 100,
  rank: 150,
  organisation_name: 72,
  certificate_link: 24,
}
const MIN_START_SIZE = 8
const AVG_CHAR_WIDTH = 0.6
const MAX_WIDTH_RATIO = 0.9
const MAX_HEIGHT_RATIO = 0.8

/** Advance width of the text and its ascent above the baseline, at a font size. */
export type Measure = (text: string, size: number) => { width: number; ascent: number }

export interface FittedText {
  size: number
  x: number
  baselineY: number
  width: number
}

export function fitText(text: string, box: Box, maxSize: number, measure: Measure): FittedText {
  let size = Math.min(
    box.width / (text.length * AVG_CHAR_WIDTH),
    box.height * MAX_HEIGHT_RATIO,
    maxSize,
  )
  size = Math.max(size, MIN_START_SIZE)

  let { width, ascent } = measure(text, size)
  const maxWidth = box.width * MAX_WIDTH_RATIO
  const maxHeight = box.height * MAX_HEIGHT_RATIO
  if (width > maxWidth || size > maxHeight) {
    size *= Math.min(maxWidth / width, maxHeight / size)
    ;({ width, ascent } = measure(text, size))
  }

  return {
    size,
    x: box.x + (box.width - width) / 2,
    baselineY: box.y + (box.height + ascent) / 2,
    width,
  }
}
