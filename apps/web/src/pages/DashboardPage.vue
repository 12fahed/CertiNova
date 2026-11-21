<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText } from 'frappe-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '@/auth/session'
import EventFormDialog from '@/components/EventFormDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import TonePill from '@/components/ui/TonePill.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { useSignedUrls } from '@/composables/useSignedUrl'
import { DashboardQuery } from '@/graphql/operations/events'
import { errorMessage } from '@/lib/errors'
import { formatDate, formatDateTime, plural } from '@/lib/format'
import { BUCKETS } from '@/lib/supabase'
import { useCurrentOrg } from '@/org/currentOrg'

const router = useRouter()
const { user } = useSession()
const { orgId, isAdmin } = useCurrentOrg()
const dashboard = useQuery({
  query: DashboardQuery,
  variables: computed(() => ({ orgId: orgId.value })),
})

const stats = computed(() => dashboard.data.value?.org_stats[0])
const events = computed(() => dashboard.data.value?.events ?? [])
const search = ref('')
const shown = computed(() => {
  const text = search.value.trim().toLowerCase()
  if (!text) return events.value
  return events.value.filter((e) => `${e.name} ${e.issuer_name}`.toLowerCase().includes(text))
})
const thumbnails = useSignedUrls(
  BUCKETS.templates,
  computed(() => events.value.flatMap((e) => (e.template ? [e.template.image_path] : []))),
)
const creating = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const name = String(user.value?.user_metadata?.full_name ?? '').split(' ')[0]
  return name ? `${part}, ${name}` : part
})

function openEvent(id: string) {
  void router.push({ name: 'event', params: { id } })
}
</script>

<template>
  <PageTitle title="Dashboard" :subtitle="greeting">
    <template #actions>
      <Button
        v-if="isAdmin"
        variant="solid"
        theme="blue"
        size="md"
        icon-left="lucide-plus"
        label="New event"
        @click="creating = true"
      />
    </template>
  </PageTitle>

  <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      label="Events"
      :value="stats?.events_count ?? 0"
      icon="lucide-calendar"
      tone="brand"
    />
    <StatCard label="Batches" :value="stats?.batches_count ?? 0" icon="lucide-layers" tone="good" />
    <StatCard
      label="Certificates"
      :value="stats?.certificates_count ?? 0"
      icon="lucide-award"
      tone="accent"
      :hint="stats?.last_batch_at ? `Last batch ${formatDateTime(stats.last_batch_at)}` : undefined"
    />
  </section>

  <section class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-ink-gray-9">Events</h2>
      <label
        v-if="events.length > 0"
        class="flex items-center gap-2 rounded-lg border border-edge bg-surface-base px-3 py-1.5 text-ink-gray-5 focus-within:border-brand-600"
      >
        <span class="lucide-search size-4" aria-hidden="true" />
        <input
          v-model="search"
          type="search"
          placeholder="Find an event"
          aria-label="Find an event"
          class="w-44 border-0 bg-transparent p-0 text-sm text-ink-gray-9 focus:ring-0"
        />
      </label>
    </div>

    <ErrorMessage v-if="dashboard.error.value" :message="errorMessage(dashboard.error.value)" />
    <LoadingText v-else-if="dashboard.fetching.value && !dashboard.data.value" />
    <EmptyState
      v-else-if="events.length === 0"
      icon="lucide-calendar-plus"
      title="No events yet"
      :description="
        isAdmin
          ? 'Make an event, upload its certificate design, then generate certificates.'
          : 'An owner or admin of your organisation must make the first event.'
      "
    >
      <Button
        v-if="isAdmin"
        variant="solid"
        theme="blue"
        label="New event"
        @click="creating = true"
      />
    </EmptyState>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      <button
        v-for="event in shown"
        :key="event.id"
        type="button"
        class="card flex flex-col overflow-hidden text-left transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
        @click="openEvent(event.id)"
      >
        <div
          class="relative grid h-32 w-full shrink-0 place-items-center overflow-hidden border-b border-edge bg-canvas"
        >
          <img
            v-if="event.template && thumbnails.get(event.template.image_path)"
            :src="thumbnails.get(event.template.image_path)"
            alt=""
            class="absolute inset-0 size-full object-contain p-3"
          />
          <span v-else-if="!event.template" class="text-sm text-ink-gray-5">No design yet</span>
        </div>
        <div class="flex w-full flex-1 flex-col gap-2 p-4">
          <div class="font-semibold text-ink-gray-9">{{ event.name }}</div>
          <div class="text-sm text-ink-gray-6">
            {{ event.issuer_name }} · {{ formatDate(event.event_date) }}
          </div>
          <div class="mt-auto flex items-center justify-between pt-1">
            <TonePill v-if="event.template" tone="good" label="Design ready" dot />
            <TonePill v-else tone="accent" label="Needs design" dot />
            <span class="text-sm text-ink-gray-6">
              {{ plural(event.batches_aggregate.aggregate?.count ?? 0, 'batch', 'batches') }}
            </span>
          </div>
        </div>
      </button>
      <button
        v-if="isAdmin && !search"
        type="button"
        class="flex min-h-56 flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-edge-strong text-sm font-semibold text-brand-700 hover:border-brand-600 hover:bg-brand-50"
        @click="creating = true"
      >
        <span class="grid size-10 place-items-center rounded-full bg-brand-100" aria-hidden="true">
          <span class="lucide-plus size-5 text-brand-600" />
        </span>
        New event
      </button>
    </div>
    <p v-if="events.length > 0 && shown.length === 0" class="text-sm text-ink-gray-6">
      No event matches “{{ search }}”.
    </p>
  </section>

  <EventFormDialog v-model:open="creating" @saved="openEvent" />
</template>
