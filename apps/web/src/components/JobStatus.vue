<script setup lang="ts">
import { Progress } from 'frappe-ui'
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

export interface JobView {
  status: string
  progress: number
  total: number
  error?: string | null
}

const props = defineProps<{ job: JobView; label: string }>()

const percent = computed(() =>
  props.job.total > 0 ? Math.round((props.job.progress / props.job.total) * 100) : 0,
)
</script>

<template>
  <div class="flex flex-col gap-2 rounded-lg border border-outline-gray-2 p-3">
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="font-medium text-ink-gray-9">{{ label }}</span>
      <StatusBadge :status="job.status" />
    </div>
    <Progress
      v-if="job.status === 'running' || job.status === 'queued'"
      :value="percent"
      size="sm"
    />
    <p v-if="job.status === 'queued'" class="text-xs text-ink-gray-5">
      Waiting for the worker to start this job.
    </p>
    <p v-else-if="job.status === 'running'" class="text-xs tabular-nums text-ink-gray-5">
      {{ job.progress }} of {{ job.total }}
    </p>
    <p v-else-if="job.status === 'failed'" class="text-xs text-ink-red-6">
      {{ job.error || 'The job failed.' }}
    </p>
  </div>
</template>
