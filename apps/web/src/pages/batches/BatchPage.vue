<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@urql/vue'
import {
  Alert,
  Button,
  ErrorMessage,
  LoadingText,
  PageHeader,
  PageHeaderTitle,
  toast,
} from 'frappe-ui'
import { computed, ref, watch } from 'vue'
import BatchDownloads from '@/components/BatchDownloads.vue'
import BatchEmails from '@/components/BatchEmails.vue'
import EmptyState from '@/components/EmptyState.vue'
import JobStatus from '@/components/JobStatus.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import {
  BatchJobsSubscription,
  BatchQuery,
  StartBatchRenderMutation,
} from '@/graphql/operations/batches'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDateTime, plural } from '@/lib/format'
import { BUCKETS, signedUrl } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'

const PAGE_SIZE = 50

const props = defineProps<{ id: string }>()
const page = ref(0)
const batchQuery = useQuery({
  query: BatchQuery,
  variables: computed(() => ({ id: props.id, limit: PAGE_SIZE, offset: page.value * PAGE_SIZE })),
})
const jobsSub = useSubscription({
  query: BatchJobsSubscription,
  variables: computed(() => ({ batchId: props.id })),
})
const startRender = useMutation(StartBatchRenderMutation)

const batch = computed(() => batchQuery.data.value?.batches_by_pk ?? null)
const jobs = computed(() => jobsSub.data.value?.jobs ?? [])
const renderJob = computed(() => jobs.value.find((job) => job.kind === 'render') ?? null)
const emailJob = computed(() => jobs.value.find((job) => job.kind === 'email') ?? null)
const pageCount = computed(() => Math.ceil((batch.value?.recipient_count ?? 0) / PAGE_SIZE))

// Reload the batch when a job ends, so statuses and counts are fresh.
const jobStates = computed(() => jobs.value.map((job) => `${job.id}:${job.status}`).join())
watch(jobStates, (now, before) => {
  if (before !== undefined && now !== before) {
    batchQuery.executeQuery({ requestPolicy: 'network-only' })
  }
})

const start = useTask(async () => {
  unwrap(await startRender.executeMutation({ batchId: props.id }))
  toast.success('Rendering started.')
  batchQuery.executeQuery({ requestPolicy: 'network-only' })
})

async function openImage(path: string) {
  try {
    window.open(await signedUrl(BUCKETS.certificates, path), '_blank', 'noopener')
  } catch (error) {
    toast.error(errorMessage(error))
  }
}
</script>

<template>
  <ErrorMessage v-if="batchQuery.error.value" :message="errorMessage(batchQuery.error.value)" />
  <LoadingText v-else-if="batchQuery.fetching.value && !batchQuery.data.value" />
  <EmptyState
    v-else-if="!batch"
    icon="lucide-file-x"
    title="Batch not found"
    description="It was deleted, or it belongs to another organisation."
  >
    <Button label="Back to dashboard" :route="{ name: 'dashboard' }" />
  </EmptyState>
  <template v-else>
    <PageHeader>
      <PageHeaderTitle :title="batch.event ? `Batch · ${batch.event.name}` : 'Batch'" />
      <StatusBadge :status="batch.status" />
    </PageHeader>
    <p class="text-sm text-ink-gray-6">
      {{ plural(batch.recipient_count, 'certificate') }} · made
      {{ formatDateTime(batch.created_at) }}
      <template v-if="batch.event">
        ·
        <RouterLink class="underline" :to="{ name: 'event', params: { id: batch.event.id } }">
          Back to event
        </RouterLink>
      </template>
    </p>

    <Alert
      v-if="batch.status === 'draft'"
      theme="amber"
      title="This batch is not started"
      description="Start the render to make the certificate images."
      :primary-action="{
        label: 'Start render',
        loading: start.loading,
        onClick: () => start.run(),
      }"
    />
    <ErrorMessage :message="start.error" />

    <div class="grid gap-3 md:grid-cols-2">
      <JobStatus v-if="renderJob" :job="renderJob" label="Render" />
      <JobStatus v-if="emailJob" :job="emailJob" label="Emails" />
    </div>

    <div v-if="batch.status === 'ready'" class="grid gap-3 md:grid-cols-2">
      <BatchDownloads :batch-id="batch.id" :jobs="jobs" />
      <BatchEmails :batch-id="batch.id" :email-job="emailJob" />
    </div>

    <section class="flex flex-col gap-2">
      <h2 class="font-medium text-ink-gray-9">Certificates</h2>
      <div class="overflow-x-auto rounded-lg border border-outline-gray-2">
        <table class="w-full min-w-[44rem] text-sm">
          <thead class="bg-surface-gray-1 text-left text-xs text-ink-gray-6">
            <tr>
              <th class="px-3 py-2 font-medium">Name</th>
              <th class="px-3 py-2 font-medium">Email</th>
              <th class="px-3 py-2 font-medium">Rank</th>
              <th class="px-3 py-2 font-medium">Image</th>
              <th class="px-3 py-2 font-medium">Email status</th>
              <th class="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="certificate in batch.certificates"
              :key="certificate.id"
              class="border-t border-outline-gray-1"
            >
              <td class="px-3 py-2 text-ink-gray-9">
                {{ certificate.recipient_name ?? 'Locked' }}
                <StatusBadge v-if="certificate.revoked_at" status="revoked" class="ml-1" />
              </td>
              <td class="px-3 py-2 text-ink-gray-7">{{ certificate.recipient_email ?? '—' }}</td>
              <td class="px-3 py-2 text-ink-gray-7">{{ certificate.rank ?? '—' }}</td>
              <td class="px-3 py-2"><StatusBadge :status="certificate.render_status" /></td>
              <td class="px-3 py-2">
                <StatusBadge
                  v-if="certificate.email_deliveries[0]"
                  :status="certificate.email_deliveries[0].status"
                  :title="certificate.email_deliveries[0].error ?? undefined"
                />
                <span v-else class="text-ink-gray-5">—</span>
              </td>
              <td class="px-3 py-2">
                <div class="flex justify-end gap-1">
                  <Button
                    v-if="certificate.file_path"
                    variant="ghost"
                    icon="lucide-image"
                    label="Open image"
                    tooltip="Open image"
                    @click="openImage(certificate.file_path)"
                  />
                  <Button
                    variant="ghost"
                    icon="lucide-shield-check"
                    label="Open verify page"
                    tooltip="Open verify page"
                    :href="`/verify/${certificate.id}`"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="pageCount > 1" class="flex items-center justify-end gap-2 text-sm text-ink-gray-6">
        <Button
          icon="lucide-chevron-left"
          label="Previous page"
          :disabled="page === 0"
          @click="page--"
        />
        Page {{ page + 1 }} of {{ pageCount }}
        <Button
          icon="lucide-chevron-right"
          label="Next page"
          :disabled="page + 1 >= pageCount"
          @click="page++"
        />
      </div>
    </section>
  </template>
</template>
