export interface Recipient {
  name: string
  email: string
  rank: string
}

export interface RowError {
  /** 1-based row number as the user sees it in the file, header included. */
  row: number
  message: string
}

export interface ParsedRecipients {
  recipients: Recipient[]
  errors: RowError[]
}

export const MAX_RECIPIENTS = 1000
const MAX_NAME_LENGTH = 200
const MAX_RANK_LENGTH = 100
// Same rule as private.is_valid_email in the database.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Header words the old app accepted. Email and rank are checked first, so that
// "Email" or "Position" never count as the name column.
const EMAIL_HEADERS = ['email', 'e-mail', 'mail']
const RANK_HEADERS = ['rank', 'position', 'standing']
const NAME_HEADERS = ['name', 'participant', 'recipient', 'candidate']

type Column = keyof Recipient

export function detectColumns(header: readonly string[]): Partial<Record<Column, number>> {
  const columns: Partial<Record<Column, number>> = {}
  header.forEach((raw, index) => {
    const title = raw.trim().toLowerCase()
    const match = (words: string[]) => words.some((word) => title.includes(word))
    if (columns.email === undefined && match(EMAIL_HEADERS)) columns.email = index
    else if (columns.rank === undefined && match(RANK_HEADERS)) columns.rank = index
    else if (columns.name === undefined && match(NAME_HEADERS)) columns.name = index
  })
  return columns
}

export function validateRecipient(recipient: Recipient): string | null {
  if (!recipient.name) return 'Name is missing.'
  if (recipient.name.length > MAX_NAME_LENGTH)
    return `Name is longer than ${MAX_NAME_LENGTH} characters.`
  if (recipient.email && !EMAIL_PATTERN.test(recipient.email)) return 'Email is not valid.'
  if (recipient.rank.length > MAX_RANK_LENGTH)
    return `Rank is longer than ${MAX_RANK_LENGTH} characters.`
  return null
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).trim()
}

/** Turns spreadsheet rows (first row = header) into recipients and row errors. */
export function rowsToRecipients(rows: readonly (readonly unknown[])[]): ParsedRecipients {
  const [header, ...body] = rows
  if (!header) return { recipients: [], errors: [{ row: 1, message: 'The file is empty.' }] }

  const columns = detectColumns(header.map(cellText))
  if (columns.name === undefined) {
    return {
      recipients: [],
      errors: [{ row: 1, message: 'Add a header row with a "name" column.' }],
    }
  }

  const recipients: Recipient[] = []
  const errors: RowError[] = []
  const read = (row: readonly unknown[], column: number | undefined) =>
    column === undefined ? '' : cellText(row[column])

  body.forEach((row, index) => {
    const recipient = {
      name: read(row, columns.name),
      email: read(row, columns.email),
      rank: read(row, columns.rank),
    }
    if (!recipient.name && !recipient.email && !recipient.rank) return
    const error = validateRecipient(recipient)
    if (error) errors.push({ row: index + 2, message: error })
    else recipients.push(recipient)
  })

  if (recipients.length > MAX_RECIPIENTS) {
    errors.unshift({ row: 1, message: `A batch can have at most ${MAX_RECIPIENTS} recipients.` })
  }
  return { recipients, errors }
}
