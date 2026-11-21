import Papa from 'papaparse'
import { rowsToRecipients, type ParsedRecipients } from './recipients'

const XLSX_TYPES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

function isXlsx(file: File): boolean {
  return XLSX_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.xlsx')
}

async function readRows(file: File): Promise<unknown[][]> {
  if (isXlsx(file)) {
    // Loaded on demand: most users import CSV.
    const { readSheet } = await import('read-excel-file/browser')
    return readSheet(file)
  }
  const parsed = Papa.parse<unknown[]>(await file.text(), { skipEmptyLines: 'greedy' })
  return parsed.data
}

/** Reads a CSV or XLSX file. The first row must be the header. */
export async function readRecipientFile(file: File): Promise<ParsedRecipients> {
  try {
    return rowsToRecipients(await readRows(file))
  } catch {
    return {
      recipients: [],
      errors: [{ row: 1, message: 'Cannot read this file. Use CSV or XLSX.' }],
    }
  }
}
