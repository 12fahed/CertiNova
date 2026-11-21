import { describe, expect, it } from 'vitest'
import {
  boxFromPoints,
  boxStyle,
  clampBox,
  MIN_BOX_SIZE,
  moveBox,
  resizeBox,
  toNatural,
} from './geometry'

const image = { width: 2000, height: 1000 }

describe('toNatural', () => {
  it('scales display pixels to natural pixels', () => {
    expect(toNatural({ x: 100, y: 50 }, { width: 500, height: 250 }, image)).toEqual({
      x: 400,
      y: 200,
    })
  })
})

describe('boxFromPoints', () => {
  it('works when the drag goes up and left', () => {
    expect(boxFromPoints({ x: 300, y: 200 }, { x: 100, y: 50 })).toEqual({
      x: 100,
      y: 50,
      width: 200,
      height: 150,
    })
  })
})

describe('clampBox', () => {
  it('keeps the box inside the image', () => {
    expect(clampBox({ x: 1900, y: -20, width: 300, height: 100 }, image)).toEqual({
      x: 1700,
      y: 0,
      width: 300,
      height: 100,
    })
  })

  it('applies the minimum size', () => {
    const box = clampBox({ x: 10, y: 10, width: 1, height: 2 }, image)
    expect(box.width).toBe(MIN_BOX_SIZE)
    expect(box.height).toBe(MIN_BOX_SIZE)
  })
})

describe('moveBox and resizeBox', () => {
  const box = { x: 100, y: 100, width: 200, height: 100 }

  it('moves without leaving the image', () => {
    expect(moveBox(box, { x: 5000, y: 10 }, image)).toEqual({ ...box, x: 1800, y: 110 })
  })

  it('resizes up to the image edge', () => {
    expect(resizeBox(box, { x: 5000, y: -95 }, image)).toEqual({
      ...box,
      width: 1900,
      height: MIN_BOX_SIZE,
    })
  })
})

describe('boxStyle', () => {
  it('gives percentages of the image', () => {
    expect(boxStyle({ x: 500, y: 250, width: 1000, height: 100 }, image)).toEqual({
      left: '25%',
      top: '25%',
      width: '50%',
      height: '10%',
    })
  })
})
