<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, Dropdown, ErrorMessage, LoadingText, dialog, toast } from 'frappe-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EventFormDialog from '@/components/EventFormDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import TonePill from '@/components/ui/TonePill.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useSignedUrl } from '@/composables/useSignedUrl'
import { FIELD_COLORS } from '@/editor/fieldColors'
import { boxStyle } from '@/editor/geometry'
import { EventQuery, UpdateEventMutation } from '@/graphql/operations/events'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDate, formatDateTime, plural } from '@/lib/format'
import { BUCKETS } from '@/lib/supabase'
import { useCurrentOrg } from '@/org/currentOrg'
import { FIELD_KEYS, FIELD_LABELS } from '@/rendering/layout'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { isAdmin } = useCurrentOrg()
const eventQuery = useQuery({ query: EventQuery, variables: computed(() => ({ id: props.id })) })
const updateEvent = useMutation(UpdateEventMutation)

const event = computed(() => {
  const found = eventQuery.data.value?.events_by_pk
  return found && !found.deleted_at ? found : null
})
const template = computed(() => event.value?.template ?? null)
const templateUrl = useSignedUrl(
  BUCKETS.templates,
  computed(() => template.value?.image_path),
)
const imageSize = computed(() =>
  template.value
    ? { width: template.value.image_width, height: template.value.image_height }
    : null,
)
const placedFields = computed(() =>
  FIELD_KEYS.flatMap((key) => template.value?.fields.filter((f) => f.field_key === key) ?? []),
)
const editing = ref(false)

const menu = [
  { label: 'Delete event', icon: 'lucide-trash-2', theme: 'red' as const, onClick: confirmDelete },
]

function confirmDelete() {
  dialog.danger({
    title: 'Delete this event?',
    message:
      'The event and its design are hidden. Issued certificates stay valid and their verify links continue to work.',
    confirmLabel: 'Delete event',
    onConfirm: async () => {
      try {
        unwrap(
          await updateEvent.executeMutation({
            id: props.id,
            set: { deleted_at: new Date().toISOString() },
          }),
        )
        toast.success('Event deleted.')
        await router.replace({ name: 'dashboard' })
      } catch (error) {
        toast.error(errorMessage(error))
      }
    },
  })
}
</script>

<template>
  <ErrorMessage v-if="eventQuery.error.value" :message="errorMessage(eventQuery.error.value)" />
  <LoadingText v-else-if="eventQuery.fetching.value && !eventQuery.data.value" />
  <EmptyState
    v-else-if="!event"
    icon="lucide-calendar-x"
    tone="bad"
    title="Event not found"
    description="It was deleted, or it belongs to another organisation."
  >
    <Button variant="outline" label="Back to dashboard" :route="{ name: 'dashboard' }" />
  </EmptyState>
  <template v-else>
    <PageTitle
      :title="event.name"
      :crumbs="[{ label: 'Dashboard', to: { name: 'dashboard' } }, { label: event.name }]"
    >
      <template #meta>
        <div class="flex flex-wrap gap-2">
          <TonePill tone="neutral" :label="`Issued by ${event.issuer_name}`" />
          <TonePill tone="neutral" :label="formatDate(event.event_date)" />
          <TonePill v-if="template" tone="good" label="Design ready" dot />
          <TonePill v-else tone="accent" label="Needs design" dot />
        </div>
      </template>
      <template #actions>
        <template v-if="isAdmin">
          <Button variant="outline" size="md" label="Edit details" @click="editing = true" />
          <Dropdown
            :options="menu"
            align="end"
            :button="{
              icon: 'lucide-ellipsis',
              label: 'Event options',
              variant: 'outline',
              size: 'md',
            }"
          />
        </template>
        <Button
          variant="solid"
          theme="blue"
          size="md"
          icon-left="lucide-sparkles"
          label="Generate certificates"
          :disabled="!template || template.fields.length === 0"
          :tooltip="template ? undefined : 'Add a certificate design first'"
          :route="{ name: 'generate', params: { id: event.id } }"
        />
      </template>
    </PageTitle>

    <div class="flex flex-wrap items-start gap-5">
      <section class="card min-w-0 flex-[3_1_420px] overflow-hidden">
        <div class="flex items-center justify-between px-5 py-3.5">
          <h2 class="font-semibold text-ink-gray-9">Certificate design</h2>
          <Button
            v-if="isAdmin"
            theme="blue"
            :icon-left="template ? 'lucide-pen-tool' : 'lucide-image-plus'"
            :label="template ? 'Edit design' : 'Add design'"
            :route="{ name: 'template-editor', params: { id: event.id } }"
          />
        </div>
        <div v-if="template && imageSize" class="border-y border-edge-soft bg-canvas p-6">
          <div class="relative mx-auto w-full max-w-xl shadow-lift">
            <img
              v-if="templateUrl"
              :src="templateUrl"
              :alt="`Certificate design for ${event.name}`"
              class="block w-full"
            />
            <div v-else :style="{ aspectRatio: `${imageSize.width} / ${imageSize.height}` }" />
            <div
              v-for="field in placedFields"
              :key="field.field_key"
              class="pointer-events-none absolute rounded-sm border-2 border-dashed"
              :class="FIELD_COLORS[field.field_key].box"
              :style="boxStyle(field, imageSize)"
            />
          </div>
        </div>
        <div v-if="template" class="flex flex-wrap gap-2 px-5 py-3.5">
          <TonePill
            v-for="field in placedFields"
            :key="field.field_key"
            :tone="FIELD_COLORS[field.field_key].tone"
            :label="
              field.field_key === 'certificate_qr'
                ? FIELD_LABELS[field.field_key]
                : `${FIELD_LABELS[field.field_key]} · ${field.font_family}`
            "
          />
        </div>
        <EmptyState
          v-else
          class="m-5"
          icon="lucide-image-plus"
          title="No design yet"
          :description="
            isAdmin
              ? 'Upload the certificate image and mark where the name, QR code and other fields go.'
              : 'An owner or admin must add the certificate design.'
          "
        />
      </section>

      <section class="card min-w-0 flex-[2_1_320px] overflow-hidden">
        <div class="flex items-center justify-between px-5 py-3.5">
          <h2 class="font-semibold text-ink-gray-9">Batches</h2>
          <span class="text-sm text-ink-gray-6">
            {{ plural(event.batches.length, 'batch', 'batches') }}
          </span>
        </div>
        <p
          v-if="event.batches.length === 0"
          class="border-t border-edge-soft px-5 py-6 text-sm text-ink-gray-6"
        >
          No certificates were generated for this event yet.
        </p>
        <RouterLink
          v-for="batch in event.batches"
          :key="batch.id"
          :to="{ name: 'batch', params: { id: batch.id } }"
          class="flex items-center justify-between gap-3 border-t border-edge-soft px-5 py-3.5 hover:bg-canvas"
        >
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-ink-gray-9">
              {{ plural(batch.recipient_count, 'certificate') }}
            </span>
            <span class="block truncate text-xs text-ink-gray-6">
              {{ formatDateTime(batch.created_at) }}
              <template v-if="batch.creator">
                · {{ batch.creator.full_name || batch.creator.email }}
              </template>
            </span>
          </span>
          <StatusBadge :status="batch.status" />
        </RouterLink>
      </section>
    </div>

    <EventFormDialog v-model:open="editing" :event="event" @saved="eventQuery.executeQuery()" />
  </template>
</template>
