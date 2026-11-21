import type { Certificates_Bool_Exp } from '@/graphql/generated/graphql'

export interface HistoryFilters {
  search: string
  eventId: string
  /** YYYY-MM-DD, inclusive. */
  from: string
  to: string
  status: 'all' | 'valid' | 'revoked'
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function likePattern(text: string): string {
  return `%${text.replace(/[\\%_]/g, '\\$&')}%`
}

function nextDay(date: string): string {
  const day = new Date(`${date}T00:00:00`)
  day.setDate(day.getDate() + 1)
  return day.toISOString()
}

/** Turns the history filters into a Hasura where clause for one organisation. */
export function certificatesWhere(orgId: string, filters: HistoryFilters): Certificates_Bool_Exp {
  const and: Certificates_Bool_Exp[] = [{ org_id: { _eq: orgId } }]
  const search = filters.search.trim()
  if (search) {
    const pattern = likePattern(search)
    const anyOf: Certificates_Bool_Exp[] = [
      { recipient_name: { _ilike: pattern } },
      { recipient_email: { _ilike: pattern } },
    ]
    if (UUID.test(search)) anyOf.push({ id: { _eq: search.toLowerCase() } })
    and.push({ _or: anyOf })
  }
  if (filters.eventId) and.push({ batch: { event_id: { _eq: filters.eventId } } })
  if (filters.from)
    and.push({ created_at: { _gte: new Date(`${filters.from}T00:00:00`).toISOString() } })
  if (filters.to) and.push({ created_at: { _lt: nextDay(filters.to) } })
  if (filters.status !== 'all') and.push({ revoked_at: { _is_null: filters.status === 'valid' } })
  return { _and: and }
}
