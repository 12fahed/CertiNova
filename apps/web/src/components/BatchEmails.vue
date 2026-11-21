<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, ErrorMessage, dialog } from 'frappe-ui'
import { computed, watch } from 'vue'
import { useFeatureFlag } from '@/composables/useFeatureFlag'
import { DeliveryCountsQuery, SendBatchEmailsMutation } from '@/graphql/operations/batches'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import TonePill from './ui/TonePill.vue'

const props = defineProps<{
  batchId: string
  emailJob: { status: string } | null
  withoutEmail: number
}>()

const enabled = useFeatureFlag('email-certificates')
const countsQuery = useQuery({
  query: DeliveryCountsQuery,
  variables: computed(() => ({ batchId: props.batchId })),
})
const sendEmails = useMutation(SendBatchEmailsMutation)

const counts = computed(() => {
  const data = countsQuery.data.value
  return {
    sent: data?.sent.aggregate?.count ?? 0,
    failed: data?.failed.aggregate?.count ?? 0,
    queued: data?.queued.aggregate?.count ?? 0,
  }
})
const busy = computed(() => ['queued', 'running'].includes(props.emailJob?.status ?? ''))
const started = computed(() => counts.value.sent + counts.value.failed + counts.value.queued > 0)

watch(
  () => props.emailJob?.status,
  () => countsQuery.executeQuery({ requestPolicy: 'network-only' }),
)

const send = useTask(async () => {
  unwrap(await sendEmails.executeMutation({ batchId: props.batchId }))
})

function confirmSend() {
  dialog.confirm({
    title: started.value ? 'Send the failed emails again?' : 'Email the certificates?',
    message: started.value
      ? 'Only recipients whose email failed get it again.'
      : 'Each recipient with an email address gets their certificate and verify link.',
    confirmLabel: 'Send',
    onConfirm: () => send.run(),
  })
}
</script>

<template>
  <section class="card flex flex-col gap-3 p-4">
    <h2 class="font-semibold text-ink-gray-9">Email</h2>
    <p v-if="!enabled" class="text-sm text-ink-gray-6">
      Email sending is not turned on for your organisation.
    </p>
    <template v-else>
      <div v-if="started" class="flex flex-wrap gap-2">
        <TonePill tone="good" :label="`${counts.sent} sent`" />
        <TonePill v-if="counts.failed" tone="bad" :label="`${counts.failed} failed`" />
        <TonePill v-if="counts.queued" tone="brand" :label="`${counts.queued} waiting`" />
        <TonePill v-if="withoutEmail" tone="neutral" :label="`${withoutEmail} with no email`" />
      </div>
      <p class="text-sm text-ink-gray-6">
        {{
          started
            ? 'Each recipient got their certificate and its verify link.'
            : 'Each recipient with an email address gets their certificate and its verify link.'
        }}
      </p>
      <div v-if="!started || counts.failed > 0">
        <Button
          variant="solid"
          theme="blue"
          icon-left="lucide-send"
          :label="started ? 'Send the failed emails again' : 'Email certificates'"
          :loading="send.loading || busy"
          @click="confirmSend"
        />
      </div>
    </template>
    <ErrorMessage :message="send.error" />
  </section>
</template>
