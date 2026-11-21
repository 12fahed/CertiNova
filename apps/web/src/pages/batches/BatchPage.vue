<script setup lang="ts">
import { useMutation, useQuery, useSubscription } from '@urql/vue'
import { Alert, Button, ErrorMessage, LoadingText, toast } from 'frappe-ui'
import { computed, ref, watch } from 'vue'
import BatchDownloads from '@/components/BatchDownloads.vue'
import BatchEmails from '@/components/BatchEmails.vue'
import InitialsAvatar from '@/components/ui/InitialsAvatar.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import StatCard from '@/components/ui/StatCard.vue'
import JobStatus from '@/components/JobStatus.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import {
  BatchJobsSubscription,
  BatchQuery,
  DeliveryCountsQuery,
  StartBatchRenderMutation,
} from '@/graphql/operations/batches'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDateTime } from '@/lib/format'
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
// Same query as BatchEmails, so urql shares one request and one cached result.
const deliveries = useQuery({
  query: DeliveryCountsQuery,
  variables: computed(() => ({ batchId: props.id })),
})

const batch = computed(() => batchQuery.data.value?.batches_by_pk ?? null)
const jobs = computed(() => jobsSub.data.value?.jobs ?? [])
const renderJob = computed(() => jobs.value.find((job) => job.kind === 'render') ?? null)
const emailJob = computed(() => jobs.value.find((job) => job.kind === 'email') ?? null)
const rendered = computed(() => batch.value?.rendered.aggregate?.count ?? 0)
const withoutEmail = computed(() => batch.value?.without_email.aggregate?.count ?? 0)
const emailsSent = computed(() => deliveries.data.value?.sent.aggregate?.count ?? 0)
const emailsFailed = computed(() => deliveries.data.value?.failed.aggregate?.count ?? 0)
const showRenderJob = computed(() => renderJob.value !== null && renderJob.value.status !== 'done')
const pageCount = computed(() => Math.ceil((batch.value?.recipient_count ?? 0) / PAGE_SIZE))

// Reload the batch when a job ends, so statuses and counts are fresh.
const jobStates = computed(() => jobs.value.map((job) => `${job.id}:${job.status}`).join())
watch(jobStates, (now, before) => {
  if (before !== undefined && now !== before) {
    batchQuery.executeQuery({ requestPolicy: 'network-only' })
    deliveries.executeQuery({ requestPolicy: 'network-only' })
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
    tone="bad"
    title="Batch not found"
    description="It was deleted, or it belongs to another organisation."
  >
    <Button variant="outline" label="Back to dashboard" :route="{ name: 'dashboard' }" />
  </EmptyState>
  <template v-else>
    <PageTitle
      :title="`Batch of ${batch.recipient_count}`"
      :crumbs="[
        { label: 'Dashboard', to: { name: 'dashboard' } },
        ...(batch.event
          ? [{ label: batch.event.name, to: { name: 'event', params: { id: batch.event.id } } }]
          : []),
        { label: 'Batch' },
      ]"
    >
      <template #badge><StatusBadge :status="batch.status" /></template>
      <template #actions>
        <span class="text-sm text-ink-gray-6">
          Made {{ formatDateTime(batch.created_at) }}
          <template v-if="batch.creator">
            by {{ batch.creator.full_name || batch.creator.email }}
          </template>
        </span>
      </template>
    </PageTitle>

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

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Certificates" :value="batch.recipient_count" />
      <StatCard label="Images" :value="`${rendered} / ${batch.recipient_count}`">
        <ProgressBar
          class="mt-1.5 w-32"
          :value="rendered"
          :total="batch.recipient_count"
          tone="good"
        />
      </StatCard>
      <StatCard label="Emails sent" :value="emailsSent" />
      <StatCard label="Emails failed" :value="emailsFailed" />
    </section>

    <div v-if="showRenderJob || emailJob" class="grid gap-3 md:grid-cols-2">
      <JobStatus v-if="showRenderJob && renderJob" :job="renderJob" label="Making images" />
      <JobStatus
        v-if="emailJob && emailJob.status !== 'done'"
        :job="emailJob"
        label="Sending emails"
      />
    </div>

    <div v-if="batch.status === 'ready'" class="grid gap-4 md:grid-cols-2">
      <BatchDownloads :batch-id="batch.id" :jobs="jobs" />
      <BatchEmails :batch-id="batch.id" :email-job="emailJob" :without-email="withoutEmail" />
    </div>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-ink-gray-9">Certificates</h2>
      <div class="card overflow-x-auto">
        <table class="data-table min-w-[48rem]">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Email</th>
              <th>Rank</th>
              <th>Image</th>
              <th>Email status</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="certificate in batch.certificates" :key="certificate.id">
              <td>
                <span class="flex items-center gap-2.5 font-medium text-ink-gray-9">
                  <InitialsAvatar :name="certificate.recipient_name ?? '?'" size="sm" />
                  {{ certificate.recipient_name ?? 'Locked' }}
                  <StatusBadge v-if="certificate.revoked_at" status="revoked" />
                </span>
              </td>
              <td class="text-ink-gray-6">{{ certificate.recipient_email ?? '—' }}</td>
              <td class="text-ink-gray-7">{{ certificate.rank ?? '—' }}</td>
              <td><StatusBadge :status="certificate.render_status" /></td>
              <td>
                <StatusBadge
                  v-if="certificate.email_deliveries[0]"
                  :status="certificate.email_deliveries[0].status"
                  :title="certificate.email_deliveries[0].error ?? undefined"
                />
                <span v-else class="text-ink-gray-5">—</span>
              </td>
              <td>
                <div class="flex justify-end gap-1">
                  <Button
                    v-if="certificate.file_path"
                    variant="ghost"
                    theme="blue"
                    icon-left="lucide-image"
                    label="View"
                    @click="openImage(certificate.file_path)"
                  />
                  <Button
                    variant="ghost"
                    theme="blue"
                    icon-left="lucide-shield-check"
                    label="Verify"
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
          variant="outline"
          icon="lucide-chevron-left"
          label="Previous page"
          :disabled="page === 0"
          @click="page--"
        />
        Page {{ page + 1 }} of {{ pageCount }}
        <Button
          variant="outline"
          icon="lucide-chevron-right"
          label="Next page"
          :disabled="page + 1 >= pageCount"
          @click="page++"
        />
      </div>
    </section>
  </template>
</template>
