import type { Box } from '@/rendering/layout'

export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

/** Smallest box the editor keeps, in natural image pixels. */
export const MIN_BOX_SIZE = 10

const round = (value: number) => Math.round(value * 100) / 100

/** Display pixels (on screen) to natural image pixels. */
export function toNatural(point: Point, display: Size, natural: Size): Point {
  return {
    x: (point.x * natural.width) / display.width,
    y: (point.y * natural.height) / display.height,
  }
}

export function boxFromPoints(a: Point, b: Point): Box {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }
}

/** Keeps the box inside the image and at least MIN_BOX_SIZE on each side. */
export function clampBox(box: Box, image: Size): Box {
  const width = Math.min(Math.max(box.width, MIN_BOX_SIZE), image.width)
  const height = Math.min(Math.max(box.height, MIN_BOX_SIZE), image.height)
  return {
    x: round(Math.min(Math.max(box.x, 0), image.width - width)),
    y: round(Math.min(Math.max(box.y, 0), image.height - height)),
    width: round(width),
    height: round(height),
  }
}

export function moveBox(box: Box, delta: Point, image: Size): Box {
  return clampBox({ ...box, x: box.x + delta.x, y: box.y + delta.y }, image)
}

/** Resizes from the bottom-right corner. */
export function resizeBox(box: Box, delta: Point, image: Size): Box {
  const width = Math.min(box.width + delta.x, image.width - box.x)
  const height = Math.min(box.height + delta.y, image.height - box.y)
  return clampBox({ ...box, width, height }, image)
}

/** Box position as CSS percentages of the image, so it follows any display size. */
export function boxStyle(box: Box, image: Size): Record<string, string> {
  const pct = (value: number, total: number) => `${(value / total) * 100}%`
  return {
    left: pct(box.x, image.width),
    top: pct(box.y, image.height),
    width: pct(box.width, image.width),
    height: pct(box.height, image.height),
  }
}
