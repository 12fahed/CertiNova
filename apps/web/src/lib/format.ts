const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Formats a date (YYYY-MM-DD) or a timestamp. Date-only values are not moved across time zones. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  return dateFormat.format(date)
}

export function formatDateTime(value: string | null | undefined): string {
  return value ? dateTimeFormat.format(new Date(value)) : '—'
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count.toLocaleString('en-GB')} ${count === 1 ? one : many}`
}
