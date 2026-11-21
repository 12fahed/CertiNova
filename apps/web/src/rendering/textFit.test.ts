import { describe, expect, it } from 'vitest'
import { fitText, type Measure } from './textFit'

// Same fake font as apps/api tests/test_text_fit.py: each char is 0.5 × size wide, ascent 0.7 × size.
const measure: Measure = (text, size) => ({ width: text.length * size * 0.5, ascent: size * 0.7 })

describe('fitText', () => {
  it('uses the start size when the text fits', () => {
    const fitted = fitText('Ada', { x: 0, y: 0, width: 600, height: 100 }, 100, measure)
    expect(fitted.size).toBe(80)
    expect(fitted.width).toBe(120)
    expect(fitted.x).toBe(240)
    expect(fitted.baselineY).toBe(78)
  })

  it('caps the size at the field maximum', () => {
    const fitted = fitText('A', { x: 0, y: 0, width: 1000, height: 1000 }, 24, measure)
    expect(fitted.size).toBe(24)
  })

  it('shrinks once when the measured text is too wide', () => {
    const wide: Measure = (text, size) => ({ width: text.length * size, ascent: size * 0.7 })
    const fitted = fitText('abcdefghij', { x: 0, y: 0, width: 300, height: 100 }, 100, wide)
    expect(fitted.size).toBeCloseTo(27)
    expect(fitted.width).toBeCloseTo(270)
  })

  it('starts at 8 px for very long text, then shrinks to fit', () => {
    const fitted = fitText('x'.repeat(200), { x: 0, y: 0, width: 100, height: 50 }, 100, measure)
    expect(fitted.size).toBeCloseTo(0.9)
  })
})
