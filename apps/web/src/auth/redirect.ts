import type { LocationQuery } from 'vue-router'

/** The in-app path to return to after login. Only same-site paths count. */
export function redirectTarget(query: LocationQuery): string | null {
  const value = query.redirect
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : null
}
