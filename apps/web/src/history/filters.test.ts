import { describe, expect, it } from 'vitest'
import { certificatesWhere, type HistoryFilters } from './filters'

const none: HistoryFilters = { search: '', eventId: '', from: '', to: '', status: 'all' }

describe('certificatesWhere', () => {
  it('always limits to the organisation', () => {
    expect(certificatesWhere('org-1', none)).toEqual({ _and: [{ org_id: { _eq: 'org-1' } }] })
  })

  it('escapes LIKE wildcards in the search text', () => {
    const where = certificatesWhere('org-1', { ...none, search: ' 50%_off ' })
    expect(where._and?.[1]).toEqual({
      _or: [
        { recipient_name: { _ilike: '%50\\%\\_off%' } },
        { recipient_email: { _ilike: '%50\\%\\_off%' } },
      ],
    })
  })

  it('also matches a certificate id', () => {
    const id = 'F0000000-0000-4000-8000-000000000001'
    const where = certificatesWhere('org-1', { ...none, search: id })
    expect(where._and?.[1]?._or).toContainEqual({ id: { _eq: id.toLowerCase() } })
  })

  it('filters revoked certificates', () => {
    const where = certificatesWhere('org-1', { ...none, status: 'revoked' })
    expect(where._and).toContainEqual({ revoked_at: { _is_null: false } })
  })
})
