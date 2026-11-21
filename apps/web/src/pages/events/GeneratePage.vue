<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CertificatePreview from '@/components/CertificatePreview.vue'
import RecipientsEditor from '@/components/RecipientsEditor.vue'
import { useSignedUrl } from '@/composables/useSignedUrl'
import { CreateBatchMutation, StartBatchRenderMutation } from '@/graphql/operations/batches'
import { EventQuery, FontsQuery } from '@/graphql/operations/events'
import { errorMessage, unwrap } from '@/lib/errors'
import { plural } from '@/lib/format'
import { BUCKETS } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'
import { validateRecipient, type Recipient } from '@/recipients/recipients'
import { buildLayout } from '@/rendering/layout'
import { verifyUrl } from '@/rendering/preview'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { org, orgId } = useCurrentOrg()
const eventQuery = useQuery({ query: EventQuery, variables: computed(() => ({ id: props.id })) })
const fontsQuery = useQuery({ query: FontsQuery, variables: {} })
const createBatch = useMutation(CreateBatchMutation)
const startRender = useMutation(StartBatchRenderMutation)

const event = computed(() => eventQuery.data.value?.events_by_pk ?? null)
const template = computed(() => event.value?.template ?? null)
const imageUrl = useSignedUrl(
  BUCKETS.templates,
  computed(() => template.value?.image_path),
)

const recipients = ref<Recipient[]>([])
const selected = ref(0)
let started = false

const layout = computed(() => {
  const value = template.value
  if (!value) return null
  const families = new Map(
    (fontsQuery.data.value?.fonts ?? []).map((f) => [f.family, f.render_family]),
  )
  return buildLayout(
    { width: value.image_width, height: value.image_height },
    org.value?.name ?? '',
    value.fields,
    families,
  )
})

const PREVIEW_ID = '00000000-0000-4000-8000-000000000000'
const previewData = computed(() => {
  const recipient = recipients.value[selected.value]
  return {
    certificateId: PREVIEW_ID,
    recipientName: recipient?.name || 'Recipient name',
    rank: recipient?.rank || null,
    verifyUrl: verifyUrl(PREVIEW_ID),
  }
})

const valid = computed(
  () => recipients.value.length > 0 && recipients.value.every((r) => validateRecipient(r) === null),
)

const generate = useTask(async () => {
  const value = event.value
  if (!value?.template || !valid.value) return
  const batch = unwrap(
    await createBatch.executeMutation({
      object: {
        org_id: orgId.value,
        event_id: value.id,
        template_id: value.template.id,
        recipient_count: recipients.value.length,
        has_rank: recipients.value.some((r) => r.rank),
        certificates: {
          data: recipients.value.map((r) => ({
            org_id: orgId.value,
            recipient_name: r.name,
            recipient_email: r.email || null,
            rank: r.rank || null,
          })),
        },
      },
    }),
  ).insert_batches_one
  if (!batch) throw new Error('The batch was not saved.')
  started = true
  try {
    unwrap(await startRender.executeMutation({ batchId: batch.id }))
  } catch (error) {
    // The batch exists as a draft. Its page has a button to start it again.
    toast.error(errorMessage(error))
  }
  await router.push({ name: 'batch', params: { id: batch.id } })
})

onBeforeRouteLeave(
  () =>
    started ||
    recipients.value.length === 0 ||
    window.confirm('Leave this page? The recipients you added are not saved.'),
)
</script>

<template>
  <ErrorMessage v-if="eventQuery.error.value" :message="errorMessage(eventQuery.error.value)" />
  <LoadingText v-else-if="!event" />
  <template v-else>
    <PageHeader>
      <PageHeaderTitle :title="`Generate · ${event.name}`" />
      <div class="flex items-center gap-2">
        <Button label="Cancel" :route="{ name: 'event', params: { id: event.id } }" />
        <Button
          variant="solid"
          :label="`Generate ${plural(recipients.length, 'certificate')}`"
          :disabled="!valid || !template"
          :loading="generate.loading"
          @click="generate.run()"
        />
      </div>
    </PageHeader>

    <ErrorMessage
      v-if="!template"
      message="This event has no design. Add a design before you generate certificates."
    />
    <ErrorMessage :message="generate.error" />

    <div class="grid gap-4 xl:grid-cols-2">
      <section class="flex min-w-0 flex-col gap-2">
        <h2 class="font-medium text-ink-gray-9">1. Add recipients</h2>
        <RecipientsEditor v-model="recipients" v-model:selected="selected" />
      </section>
      <section class="flex min-w-0 flex-col gap-2">
        <h2 class="font-medium text-ink-gray-9">2. Check the preview</h2>
        <div class="overflow-hidden rounded-lg border border-outline-gray-2">
          <CertificatePreview
            v-if="imageUrl && layout"
            :image-url="imageUrl"
            :layout="layout"
            :data="previewData"
          />
          <div v-else class="aspect-[1.414]" />
        </div>
        <p class="text-xs text-ink-gray-5">
          Select a row to preview it. The final images are made on the server with the same layout.
          The QR code and ID in the preview are samples.
        </p>
      </section>
    </div>
  </template>
</template>
