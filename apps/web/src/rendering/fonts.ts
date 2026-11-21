import type { FieldStyle } from './layout'

// The server draws system fonts with Liberation and DejaVu (Debian packages).
// Google Fonts has metric-compatible copies of most of them.
const BROWSER_FAMILY: Record<string, string> = {
  'Liberation Sans': 'Arimo',
  'Liberation Serif': 'Tinos',
  'DejaVu Sans Mono': 'Cousine',
}
// Not on Google Fonts. The preview uses an installed copy, else the CSS fallback.
const LOCAL_ONLY: Record<string, string> = { 'DejaVu Sans': 'Verdana, sans-serif' }

export interface ResolvedFont {
  family: string
  bold: boolean
  italic: boolean
}

// Family -> variants it has, as "<weight>-<style>", for example "700-italic".
const families = new Map<string, Promise<Set<string>>>()

function variantKey(bold: boolean, italic: boolean): string {
  return `${bold ? 700 : 400}-${italic ? 'italic' : 'normal'}`
}

// The older CSS API returns only the variants that exist, in one request.
// css2 answers 400 (without CORS headers) when one asked variant is missing.
function googleCssUrl(family: string): string {
  return `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:400,700,400italic,700italic&display=block`
}

function loadFamily(family: string): Promise<Set<string>> {
  let pending = families.get(family)
  if (!pending) {
    pending = (async () => {
      const response = await fetch(googleCssUrl(family))
      if (!response.ok) return new Set<string>()
      const css = await response.text()
      const style = document.createElement('style')
      style.textContent = css
      document.head.append(style)
      const variants = new Set<string>()
      for (const face of css.matchAll(/font-style:\s*(normal|italic);\s*font-weight:\s*(\d+)/g)) {
        variants.add(`${face[2]}-${face[1]}`)
      }
      return variants
    })().catch(() => new Set<string>())
    families.set(family, pending)
  }
  return pending
}

/** Loads the font for a field. Uses the regular variant when the asked one does not exist. */
export async function resolveFont(style: FieldStyle): Promise<ResolvedFont> {
  const family = BROWSER_FAMILY[style.renderFamily] ?? style.renderFamily
  if (family in LOCAL_ONLY) return { family, bold: style.bold, italic: style.italic }
  const variants = await loadFamily(family)
  const font = variants.has(variantKey(style.bold, style.italic))
    ? { family, bold: style.bold, italic: style.italic }
    : { family, bold: false, italic: false }
  await document.fonts.load(cssFont(font, 16))
  return font
}

export function cssFont(font: ResolvedFont, size: number): string {
  const fallback = LOCAL_ONLY[font.family] ?? 'sans-serif'
  return `${font.italic ? 'italic ' : ''}${font.bold ? 700 : 400} ${size}px "${font.family}", ${fallback}`
}
