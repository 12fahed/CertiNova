<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import {
  Button,
  Dropdown,
  ErrorMessage,
  LoadingText,
  PageHeader,
  PageHeaderTitle,
  dialog,
  toast,
} from 'frappe-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import EventFormDialog from '@/components/EventFormDialog.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { useSignedUrl } from '@/composables/useSignedUrl'
import { EventQuery, UpdateEventMutation } from '@/graphql/operations/events'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDate, formatDateTime, plural } from '@/lib/format'
import { BUCKETS } from '@/lib/supabase'
import { useCurrentOrg } from '@/org/currentOrg'

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
const editing = ref(false)

const menu = computed(() => [
  { label: 'Edit details', icon: 'lucide-pencil', onClick: () => (editing.value = true) },
  { label: 'Delete event', icon: 'lucide-trash-2', theme: 'red' as const, onClick: confirmDelete },
])

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
    title="Event not found"
    description="It was deleted, or it belongs to another organisation."
  >
    <Button label="Back to dashboard" :route="{ name: 'dashboard' }" />
  </EmptyState>
  <template v-else>
    <PageHeader>
      <PageHeaderTitle :title="event.name" />
      <div class="flex items-center gap-2">
        <Dropdown
          v-if="isAdmin"
          :options="menu"
          :button="{ icon: 'lucide-ellipsis', label: 'Event options' }"
        />
        <Button
          variant="solid"
          icon-left="lucide-sparkles"
          label="Generate"
          :disabled="!template || template.fields.length === 0"
          :tooltip="template ? undefined : 'Add a certificate design first'"
          :route="{ name: 'generate', params: { id: event.id } }"
        />
      </div>
    </PageHeader>

    <p class="text-sm text-ink-gray-6">
      Issued by {{ event.issuer_name }} · {{ formatDate(event.event_date) }}
    </p>

    <section class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-ink-gray-9">Certificate design</h2>
        <Button
          v-if="isAdmin && template"
          icon-left="lucide-pen-tool"
          label="Edit design"
          :route="{ name: 'template-editor', params: { id: event.id } }"
        />
      </div>
      <div
        v-if="template"
        class="overflow-hidden rounded-lg border border-outline-gray-2 bg-surface-gray-1"
      >
        <img
          v-if="templateUrl"
          :src="templateUrl"
          :alt="`Certificate design for ${event.name}`"
          class="mx-auto max-h-96 w-auto"
        />
        <div v-else class="aspect-[1.414] max-h-96" />
      </div>
      <EmptyState
        v-else
        icon="lucide-image-plus"
        title="No design yet"
        :description="
          isAdmin
            ? 'Upload the certificate image and mark where the name, QR code and other fields go.'
            : 'An owner or admin must add the certificate design.'
        "
      >
        <Button
          v-if="isAdmin"
          variant="solid"
          label="Add design"
          :route="{ name: 'template-editor', params: { id: event.id } }"
        />
      </EmptyState>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-ink-gray-9">Batches</h2>
      <p v-if="event.batches.length === 0" class="text-sm text-ink-gray-6">
        No certificates were generated for this event yet.
      </p>
      <ul v-else class="divide-y divide-outline-gray-1 rounded-lg border border-outline-gray-2">
        <li v-for="batch in event.batches" :key="batch.id">
          <RouterLink
            :to="{ name: 'batch', params: { id: batch.id } }"
            class="flex flex-col gap-1 px-4 py-3 hover:bg-surface-gray-1 sm:flex-row sm:items-center sm:justify-between"
          >
            <span class="flex flex-col">
              <span class="font-medium text-ink-gray-9">
                {{ plural(batch.recipient_count, 'certificate') }}
              </span>
              <span class="text-sm text-ink-gray-6">
                {{ formatDateTime(batch.created_at) }}
                <template v-if="batch.creator">
                  · {{ batch.creator.full_name || batch.creator.email }}
                </template>
              </span>
            </span>
            <StatusBadge :status="batch.status" />
          </RouterLink>
        </li>
      </ul>
    </section>

    <EventFormDialog v-model:open="editing" :event="event" @saved="eventQuery.executeQuery()" />
  </template>
</template>
