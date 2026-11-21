<script setup lang="ts">
import { computed } from 'vue'
import TonePill from './TonePill.vue'
import type { Tone } from './tones'

const STATUS: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'accent' },
  queued: { label: 'Queued', tone: 'brand' },
  rendering: { label: 'Rendering', tone: 'brand' },
  running: { label: 'Running', tone: 'brand' },
  ready: { label: 'Ready', tone: 'good' },
  done: { label: 'Done', tone: 'good' },
  valid: { label: 'Valid', tone: 'good' },
  sent: { label: 'Sent', tone: 'good' },
  pending: { label: 'Pending', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'bad' },
  revoked: { label: 'Revoked', tone: 'bad' },
}

const props = defineProps<{ status: string }>()
const shown = computed(
  () => STATUS[props.status] ?? { label: props.status, tone: 'neutral' as const },
)
</script>

<template>
  <TonePill :tone="shown.tone" :label="shown.label" dot />
</template>
