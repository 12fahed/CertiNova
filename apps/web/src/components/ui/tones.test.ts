import { describe, expect, it } from 'vitest'
import { initials, toneFor } from './tones'

describe('initials', () => {
  it.each([
    ['Aarav Mehta', 'AM'],
    ['owner@certinova.local', 'OW'],
    ['Demo University', 'DU'],
    ['  ', '?'],
  ])('%s -> %s', (name, expected) => {
    expect(initials(name)).toBe(expected)
  })
})

describe('toneFor', () => {
  it('gives the same tone for the same key', () => {
    expect(toneFor('event-1')).toBe(toneFor('event-1'))
  })
})
