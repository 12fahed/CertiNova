<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { Badge, Button, ErrorMessage, LoadingText, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import EventFormDialog from '@/components/EventFormDialog.vue'
import StatCard from '@/components/StatCard.vue'
import { DashboardQuery } from '@/graphql/operations/events'
import { errorMessage } from '@/lib/errors'
import { formatDate, formatDateTime, plural } from '@/lib/format'
import { useCurrentOrg } from '@/org/currentOrg'

const router = useRouter()
const { orgId, isAdmin } = useCurrentOrg()
const dashboard = useQuery({
  query: DashboardQuery,
  variables: computed(() => ({ orgId: orgId.value })),
})

const stats = computed(() => dashboard.data.value?.org_stats[0])
const events = computed(() => dashboard.data.value?.events ?? [])
const creating = ref(false)

function openEvent(id: string) {
  void router.push({ name: 'event', params: { id } })
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Dashboard" />
    <Button
      v-if="isAdmin"
      variant="solid"
      icon-left="lucide-plus"
      label="New event"
      @click="creating = true"
    />
  </PageHeader>

  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <StatCard label="Events" :value="stats?.events_count ?? 0" />
    <StatCard label="Batches" :value="stats?.batches_count ?? 0" />
    <StatCard
      label="Certificates"
      :value="stats?.certificates_count ?? 0"
      :hint="stats?.last_batch_at ? `Last batch ${formatDateTime(stats.last_batch_at)}` : undefined"
    />
  </div>

  <section class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold text-ink-gray-9">Events</h2>
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
      <Button v-if="isAdmin" variant="solid" label="New event" @click="creating = true" />
    </EmptyState>
    <ul v-else class="divide-y divide-outline-gray-1 rounded-lg border border-outline-gray-2">
      <li v-for="event in events" :key="event.id">
        <button
          type="button"
          class="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-surface-gray-1 sm:flex-row sm:items-center sm:justify-between"
          @click="openEvent(event.id)"
        >
          <span class="flex flex-col">
            <span class="font-medium text-ink-gray-9">{{ event.name }}</span>
            <span class="text-sm text-ink-gray-6">
              {{ event.issuer_name }} · {{ formatDate(event.event_date) }}
            </span>
          </span>
          <span class="flex items-center gap-2">
            <Badge v-if="!event.template" theme="amber" label="No design" />
            <span class="text-sm text-ink-gray-6">
              {{ plural(event.batches_aggregate.aggregate?.count ?? 0, 'batch', 'batches') }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </section>

  <EventFormDialog v-model:open="creating" @saved="openEvent" />
</template>
