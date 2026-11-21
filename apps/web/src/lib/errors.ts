import type { CombinedError } from '@urql/vue'

const FALLBACK = 'Something went wrong. Try again.'

function isCombinedError(error: unknown): error is CombinedError {
  return typeof error === 'object' && error !== null && 'graphQLErrors' in error
}

/** A message that is safe to show to the user. Action errors already carry one. */
export function errorMessage(error: unknown): string {
  if (isCombinedError(error)) {
    if (error.networkError) return 'Cannot reach the server. Check your connection.'
    const first = error.graphQLErrors[0]
    if (!first) return FALLBACK
    const code = first.extensions?.code
    if (code === 'permission-error') return 'You do not have permission to do this.'
    if (code === 'constraint-violation') return 'This value is not valid or is already in use.'
    if (code === 'validation-failed') return FALLBACK
    return first.message
  }
  if (error instanceof Error && error.message) return error.message
  return FALLBACK
}

/** Throws when an urql result has an error, so callers can use one try/catch. */
export function unwrap<T>(result: { data?: T; error?: CombinedError }): T {
  if (result.error) throw result.error
  if (result.data === undefined) throw new Error(FALLBACK)
  return result.data
}
