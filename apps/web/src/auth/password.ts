// Same rule as supabase/config.toml: 8+ characters with letters and digits.
const MIN_LENGTH = 8

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_LENGTH) return `Use ${MIN_LENGTH} or more characters.`
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return 'Use letters and digits.'
  return null
}
