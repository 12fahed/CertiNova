<script setup lang="ts">
import { useClientHandle, useMutation } from '@urql/vue'
import { Button, ErrorMessage } from 'frappe-ui'
import { computed } from 'vue'
import type { BatchJobsSubscription } from '@/graphql/generated/graphql'
import { ExportBatchMutation, ExportUrlQuery } from '@/graphql/operations/batches'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import IconTile from './ui/IconTile.vue'
import ProgressBar from './ui/ProgressBar.vue'
import type { Tone } from './ui/tones'

type Job = BatchJobsSubscription['jobs'][number]
type Format = 'images_zip' | 'combined_pdf' | 'individual_pdfs'

const props = defineProps<{ batchId: string; jobs: readonly Job[] }>()

const FORMATS: { value: Format; label: string; detail: string; icon: string; tone: Tone }[] = [
  {
    value: 'images_zip',
    label: 'All images',
    detail: 'ZIP of PNG files',
    icon: 'lucide-image',
    tone: 'brand',
  },
  {
    value: 'combined_pdf',
    label: 'One PDF',
    detail: 'Every certificate, one page each',
    icon: 'lucide-file-text',
    tone: 'bad',
  },
  {
    value: 'individual_pdfs',
    label: 'One PDF for each person',
    detail: 'ZIP of PDF files',
    icon: 'lucide-files',
    tone: 'accent',
  },
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
  <section class="card flex flex-col gap-3 p-4">
    <h2 class="font-semibold text-ink-gray-9">Download</h2>
    <ul class="flex flex-col gap-2">
      <li
        v-for="format in FORMATS"
        :key="format.value"
        class="flex items-center gap-3 rounded-lg border p-3"
        :class="
          latest.get(format.value)?.status === 'done'
            ? 'border-brand-200 bg-brand-50'
            : 'border-edge'
        "
      >
        <IconTile :icon="format.icon" :tone="format.tone" size="sm" />
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold text-ink-gray-9">{{ format.label }}</div>
          <template v-if="['queued', 'running'].includes(latest.get(format.value)?.status ?? '')">
            <div class="text-xs text-brand-700">
              Preparing · {{ latest.get(format.value)!.progress }} of
              {{ latest.get(format.value)!.total }}
            </div>
            <ProgressBar
              class="mt-1.5"
              :value="latest.get(format.value)!.progress"
              :total="latest.get(format.value)!.total"
            />
          </template>
          <div
            v-else-if="latest.get(format.value)?.status === 'done'"
            class="text-xs text-good-700"
          >
            Ready to download
          </div>
          <div
            v-else-if="latest.get(format.value)?.status === 'failed'"
            class="text-xs text-bad-700"
          >
            {{ latest.get(format.value)!.error || 'Failed. Try again.' }}
          </div>
          <div v-else class="text-xs text-ink-gray-6">{{ format.detail }}</div>
        </div>
        <Button
          v-if="latest.get(format.value)?.status === 'done'"
          variant="solid"
          theme="blue"
          icon-left="lucide-download"
          label="Download"
          :loading="download.loading"
          @click="download.run(latest.get(format.value)!.id)"
        />
        <Button
          v-else-if="!['queued', 'running'].includes(latest.get(format.value)?.status ?? '')"
          variant="outline"
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
