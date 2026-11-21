export type Tone = 'brand' | 'good' | 'accent' | 'bad' | 'plum' | 'sun' | 'neutral'

// Full class names (not built from parts) so Tailwind keeps them.
export const TONES: Record<Tone, { soft: string; dot: string; icon: string }> = {
  brand: {
    soft: 'bg-brand-100 text-brand-800',
    dot: 'bg-brand-600',
    icon: 'bg-brand-100 text-brand-600',
  },
  good: { soft: 'bg-good-50 text-good-700', dot: 'bg-good-600', icon: 'bg-good-50 text-good-600' },
  accent: {
    soft: 'bg-accent-50 text-accent-800',
    dot: 'bg-accent-600',
    icon: 'bg-accent-50 text-accent-600',
  },
  bad: { soft: 'bg-bad-50 text-bad-800', dot: 'bg-bad-600', icon: 'bg-bad-50 text-bad-600' },
  plum: { soft: 'bg-plum-50 text-plum-800', dot: 'bg-plum-600', icon: 'bg-plum-50 text-plum-600' },
  sun: { soft: 'bg-sun-50 text-sun-800', dot: 'bg-sun-600', icon: 'bg-sun-50 text-sun-600' },
  neutral: {
    soft: 'bg-surface-gray-2 text-ink-gray-7',
    dot: 'bg-surface-gray-6',
    icon: 'bg-surface-gray-2 text-ink-gray-6',
  },
}

const ROTATION: Tone[] = ['brand', 'good', 'accent', 'plum', 'sun', 'bad']

/** A stable tone for a key, so the same event or person keeps one colour. */
export function toneFor(key: string): Tone {
  let hash = 0
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return ROTATION[Math.abs(hash) % ROTATION.length] ?? 'brand'
}

export function initials(name: string): string {
  // For an email address, use the part before the @.
  const words = (name.split('@')[0] ?? '')
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  const letters =
    words.length > 1 ? `${words[0]![0]}${words[1]![0]}` : (words[0] ?? '?').slice(0, 2)
  return letters.toUpperCase()
}
