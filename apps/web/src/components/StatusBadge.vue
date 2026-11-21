<script setup lang="ts">
import { Badge } from 'frappe-ui'
import { computed } from 'vue'

type Theme = 'gray' | 'blue' | 'green' | 'amber' | 'red'

const STATUS: Record<string, { label: string; theme: Theme }> = {
  draft: { label: 'Draft', theme: 'gray' },
  queued: { label: 'Queued', theme: 'blue' },
  rendering: { label: 'Rendering', theme: 'blue' },
  running: { label: 'Running', theme: 'blue' },
  ready: { label: 'Ready', theme: 'green' },
  done: { label: 'Done', theme: 'green' },
  sent: { label: 'Sent', theme: 'green' },
  pending: { label: 'Pending', theme: 'gray' },
  failed: { label: 'Failed', theme: 'red' },
  revoked: { label: 'Revoked', theme: 'red' },
}

const props = defineProps<{ status: string }>()
const shown = computed(
  () => STATUS[props.status] ?? { label: props.status, theme: 'gray' as const },
)
</script>

<template>
  <Badge :theme="shown.theme" :label="shown.label" />
</template>
