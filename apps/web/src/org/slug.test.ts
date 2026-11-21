import { describe, expect, it } from 'vitest'
import { slugify, slugProblem } from './slug'

describe('slugify', () => {
  it('makes a database-safe slug', () => {
    expect(slugify('  Demo Université — Pune!! ')).toBe('demo-universite-pune')
  })

  it('does not end with a hyphen after it cuts the length', () => {
    expect(slugify(`${'a'.repeat(63)} b`)).toBe('a'.repeat(63))
  })
})

describe('slugProblem', () => {
  it.each([
    ['ab', /3 to 64/],
    ['Demo', /lowercase/],
    ['demo--uni', /single hyphens/],
  ])('rejects %s', (slug, message) => {
    expect(slugProblem(slug)).toMatch(message)
  })

  it('accepts a valid slug', () => {
    expect(slugProblem('demo-university')).toBeNull()
  })
})
