<script setup lang="ts">
import { useClientHandle, useMutation } from '@urql/vue'
import { Button, ErrorMessage } from 'frappe-ui'
import { computed } from 'vue'
import type { BatchJobsSubscription } from '@/graphql/generated/graphql'
import { ExportBatchMutation, ExportUrlQuery } from '@/graphql/operations/batches'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'

type Job = BatchJobsSubscription['jobs'][number]
type Format = 'images_zip' | 'combined_pdf' | 'individual_pdfs'

const props = defineProps<{ batchId: string; jobs: readonly Job[] }>()

const FORMATS: { value: Format; label: string; icon: string }[] = [
  { value: 'images_zip', label: 'All images (ZIP)', icon: 'lucide-file-archive' },
  { value: 'combined_pdf', label: 'One PDF', icon: 'lucide-file-text' },
  { value: 'individual_pdfs', label: 'One PDF for each person (ZIP)', icon: 'lucide-files' },
]

const client = useClientHandle()
const exportBatch = useMutation(ExportBatchMutation)

const latest = computed(() => {
  const byFormat = new Map<Format, Job>()
  for (const job of props.jobs) {
    const format = job.kind === 'export' ? (job.result?.format as Format | undefined) : undefined
    if (format && !byFormat.has(format)) byFormat.set(format, job)
  }
  return byFormat
})

const prepare = useTask(async (format: Format) => {
  unwrap(await exportBatch.executeMutation({ batchId: props.batchId, format }))
})

const download = useTask(async (jobId: string) => {
  const result = await client.client.query(
    ExportUrlQuery,
    { jobId },
    { requestPolicy: 'network-only' },
  )
  window.location.assign(unwrap(result).get_export_url.url)
})
</script>

<template>
  <section class="flex flex-col gap-3 rounded-lg border border-outline-gray-2 p-4">
    <h2 class="font-medium text-ink-gray-9">Download</h2>
    <ul class="flex flex-col gap-2">
      <li
        v-for="format in FORMATS"
        :key="format.value"
        class="flex items-center justify-between gap-2"
      >
        <span class="flex items-center gap-2 text-sm text-ink-gray-8">
          <span :class="[format.icon, 'size-4 text-ink-gray-5']" aria-hidden="true" />
          {{ format.label }}
        </span>
        <template v-if="latest.get(format.value)?.status === 'done'">
          <Button
            variant="solid"
            icon-left="lucide-download"
            label="Download"
            :loading="download.loading"
            @click="download.run(latest.get(format.value)!.id)"
          />
        </template>
        <Button
          v-else-if="['queued', 'running'].includes(latest.get(format.value)?.status ?? '')"
          label="Preparing…"
          loading
        />
        <Button
          v-else
          label="Prepare"
          :loading="prepare.loading"
          @click="prepare.run(format.value)"
        />
      </li>
    </ul>
    <p class="text-xs text-ink-gray-5">
      Large batches take a few minutes. You can leave this page and come back later.
    </p>
    <ErrorMessage :message="prepare.error ?? download.error" />
  </section>
</template>
