<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText, toast } from 'frappe-ui'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CertificatePreview from '@/components/CertificatePreview.vue'
import RecipientsEditor from '@/components/RecipientsEditor.vue'
import FocusHeader from '@/components/ui/FocusHeader.vue'
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

const invalidCount = computed(() => recipients.value.filter((r) => validateRecipient(r)).length)
const step = computed(() => (generate.loading ? 3 : valid.value ? 2 : 1))
const STEPS = ['Recipients', 'Check preview', 'Generate']

function showRecipient(delta: number) {
  const last = recipients.value.length - 1
  selected.value = Math.min(Math.max(selected.value + delta, 0), Math.max(last, 0))
}

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
  <ErrorMessage
    v-if="eventQuery.error.value"
    class="m-6"
    :message="errorMessage(eventQuery.error.value)"
  />
  <LoadingText v-else-if="!event" class="m-6" />
  <template v-else>
    <FocusHeader
      :back="{ name: 'event', params: { id: event.id } }"
      :eyebrow="event.name"
      title="Generate certificates"
    >
      <template #center>
        <ol class="hidden items-center gap-3 md:flex" aria-label="Steps">
          <template v-for="(label, index) in STEPS" :key="label">
            <li
              v-if="index > 0"
              class="h-0.5 w-8 rounded-full"
              :class="step > index ? 'bg-brand-600' : 'bg-edge'"
              aria-hidden="true"
            />
            <li
              class="flex items-center gap-2 text-sm font-semibold"
              :class="step === index + 1 ? 'text-ink-gray-9' : 'text-ink-gray-5'"
              :aria-current="step === index + 1 ? 'step' : undefined"
            >
              <span
                class="grid size-6 place-items-center rounded-full text-xs font-bold"
                :class="
                  step > index + 1
                    ? 'bg-good-600 text-white'
                    : step === index + 1
                      ? 'bg-brand-600 text-white'
                      : 'bg-surface-gray-2 text-ink-gray-5'
                "
              >
                <span v-if="step > index + 1" class="lucide-check size-3.5" aria-hidden="true" />
                <template v-else>{{ index + 1 }}</template>
              </span>
              {{ label }}
            </li>
          </template>
        </ol>
      </template>
      <template #actions>
        <Button
          variant="outline"
          label="Cancel"
          :route="{ name: 'event', params: { id: event.id } }"
        />
      </template>
    </FocusHeader>

    <div class="flex flex-1 flex-wrap items-start gap-5 p-4 sm:p-6">
      <div v-if="!template || generate.error" class="w-full">
        <ErrorMessage
          v-if="!template"
          message="This event has no design. Add a design before you generate certificates."
        />
        <ErrorMessage :message="generate.error" />
      </div>
      <section class="min-w-0 flex-[1_1_460px]">
        <RecipientsEditor v-model="recipients" v-model:selected="selected" />
      </section>
      <section class="card flex min-w-0 flex-[1_1_420px] flex-col gap-3 p-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-ink-gray-9">Preview</h2>
          <div v-if="recipients.length" class="flex items-center gap-2 text-sm text-ink-gray-6">
            <Button
              variant="outline"
              icon="lucide-chevron-left"
              label="Previous recipient"
              :disabled="selected === 0"
              @click="showRecipient(-1)"
            />
            <span class="tabular-nums">{{ selected + 1 }} of {{ recipients.length }}</span>
            <Button
              variant="outline"
              icon="lucide-chevron-right"
              label="Next recipient"
              :disabled="selected >= recipients.length - 1"
              @click="showRecipient(1)"
            />
          </div>
        </div>
        <div class="overflow-hidden rounded-lg border border-edge">
          <CertificatePreview
            v-if="imageUrl && layout"
            :image-url="imageUrl"
            :layout="layout"
            :data="previewData"
          />
          <div v-else class="aspect-[1.414] bg-canvas" />
        </div>
        <p class="text-xs text-ink-gray-5">
          The QR code and ID here are samples. The server makes the final images with this layout.
        </p>
      </section>
    </div>

    <footer
      class="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-edge bg-surface-base px-4 py-3 sm:px-6"
    >
      <div class="text-sm">
        <template v-if="recipients.length === 0">
          <span class="text-ink-gray-6">Add recipients to continue.</span>
        </template>
        <template v-else>
          <b class="text-ink-gray-9">
            {{ plural(recipients.length - invalidCount, 'recipient') }} ready
          </b>
          <span v-if="invalidCount" class="text-bad-700">
            · fix {{ plural(invalidCount, 'row') }} to continue
          </span>
        </template>
      </div>
      <Button
        variant="solid"
        theme="blue"
        size="md"
        icon-left="lucide-sparkles"
        :label="`Generate ${plural(recipients.length, 'certificate')}`"
        :disabled="!valid || !template"
        :loading="generate.loading"
        @click="generate.run()"
      />
    </footer>
  </template>
</template>
