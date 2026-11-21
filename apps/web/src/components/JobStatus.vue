<script setup lang="ts">
import ProgressBar from './ui/ProgressBar.vue'
import StatusBadge from './ui/StatusBadge.vue'

export interface JobView {
  status: string
  progress: number
  total: number
  error?: string | null
}

defineProps<{ job: JobView; label: string }>()
</script>

<template>
  <div class="card flex flex-col gap-2 p-4">
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="font-semibold text-ink-gray-9">{{ label }}</span>
      <StatusBadge :status="job.status" />
    </div>
    <ProgressBar
      v-if="job.status === 'running' || job.status === 'queued'"
      :value="job.progress"
      :total="job.total"
    />
    <p v-if="job.status === 'queued'" class="text-xs text-ink-gray-5">
      Waiting for the worker to start this job.
    </p>
    <p v-else-if="job.status === 'running'" class="text-xs tabular-nums text-ink-gray-5">
      {{ job.progress }} of {{ job.total }}
    </p>
    <p v-else-if="job.status === 'failed'" class="text-xs text-bad-700">
      {{ job.error || 'The job failed.' }}
    </p>
  </div>
</template>
