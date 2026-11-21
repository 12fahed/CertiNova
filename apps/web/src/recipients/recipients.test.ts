import { describe, expect, it } from 'vitest'
import { detectColumns, MAX_RECIPIENTS, rowsToRecipients, validateRecipient } from './recipients'

describe('detectColumns', () => {
  it('finds the columns of the sample file', () => {
    expect(detectColumns(['name', 'email', 'rank'])).toEqual({ name: 0, email: 1, rank: 2 })
  })

  it('does not take "Email address" or "Position" as the name column', () => {
    expect(detectColumns(['Email Address', 'Position', 'Student Name'])).toEqual({
      email: 0,
      rank: 1,
      name: 2,
    })
  })
})

describe('validateRecipient', () => {
  it('accepts a recipient with no email and no rank', () => {
    expect(validateRecipient({ name: 'Priya Nair', email: '', rank: '' })).toBeNull()
  })

  it('rejects an email the database would reject', () => {
    expect(validateRecipient({ name: 'A', email: 'a@b', rank: '' })).toBe('Email is not valid.')
  })
})

describe('rowsToRecipients', () => {
  it('reads rows, skips empty rows and reports bad rows with file row numbers', () => {
    const result = rowsToRecipients([
      ['Name', 'Email', 'Rank'],
      ['  Aarav Mehta ', 'aarav@example.com', '1st Place'],
      ['', '', ''],
      ['', 'no-name@example.com', ''],
      ['Priya Nair', null, 'Participant'],
    ])
    expect(result.recipients).toEqual([
      { name: 'Aarav Mehta', email: 'aarav@example.com', rank: '1st Place' },
      { name: 'Priya Nair', email: '', rank: 'Participant' },
    ])
    expect(result.errors).toEqual([{ row: 4, message: 'Name is missing.' }])
  })

  it('needs a name column', () => {
    expect(rowsToRecipients([['email'], ['a@example.com']]).errors[0]?.message).toMatch(/name/)
  })

  it('limits the batch size', () => {
    const rows = [['name'], ...Array.from({ length: MAX_RECIPIENTS + 1 }, (_, i) => [`P${i}`])]
    expect(rowsToRecipients(rows).errors[0]?.message).toMatch(/at most/)
  })
})
