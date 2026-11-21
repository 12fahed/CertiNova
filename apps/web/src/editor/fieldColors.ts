import type { Tone } from '@/components/ui/tones'
import type { FieldKey } from '@/rendering/layout'

// One colour per field, used by the editor boxes, the field list and the event page legend.
export const FIELD_COLORS: Record<FieldKey, { box: string; dot: string; tone: Tone }> = {
  recipient_name: { box: 'border-brand-600 bg-brand-600/10', dot: 'bg-brand-600', tone: 'brand' },
  organisation_name: { box: 'border-good-600 bg-good-600/10', dot: 'bg-good-600', tone: 'good' },
  rank: { box: 'border-bad-600 bg-bad-600/10', dot: 'bg-bad-600', tone: 'bad' },
  certificate_link: { box: 'border-plum-600 bg-plum-600/10', dot: 'bg-plum-600', tone: 'plum' },
  certificate_qr: { box: 'border-sun-600 bg-sun-600/10', dot: 'bg-sun-600', tone: 'sun' },
}
