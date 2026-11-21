// Same rule as organizations.slug in the database.
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const SLUG_MIN = 3
export const SLUG_MAX = 64

export function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX)
    .replace(/-+$/, '')
}

export function slugProblem(slug: string): string | null {
  if (slug.length < SLUG_MIN || slug.length > SLUG_MAX) {
    return `Use ${SLUG_MIN} to ${SLUG_MAX} characters.`
  }
  if (!SLUG_PATTERN.test(slug)) return 'Use lowercase letters, digits and single hyphens.'
  return null
}
