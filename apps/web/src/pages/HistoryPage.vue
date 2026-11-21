<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import {
  Button,
  ErrorMessage,
  FormControl,
  LoadingText,
  Select,
  TabButtons,
  toast,
} from 'frappe-ui'
import { computed, reactive, ref, watch } from 'vue'
import RevokeDialog from '@/components/RevokeDialog.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import TonePill from '@/components/ui/TonePill.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { toneFor } from '@/components/ui/tones'
import { CertificatesSearchQuery, RevokeCertificateMutation } from '@/graphql/operations/batches'
import { EventOptionsQuery } from '@/graphql/operations/events'
import { certificatesWhere, type HistoryFilters } from '@/history/filters'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDate, plural } from '@/lib/format'
import { useCurrentOrg } from '@/org/currentOrg'

const PAGE_SIZE = 50
const SEARCH_DELAY_MS = 300

const { orgId, isAdmin } = useCurrentOrg()
const filters = reactive<HistoryFilters>({
  search: '',
  eventId: '',
  from: '',
  to: '',
  status: 'all',
})
const searchInput = ref('')
const page = ref(0)

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchInput, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => (filters.search = value), SEARCH_DELAY_MS)
})
watch(filters, () => (page.value = 0))

const eventsQuery = useQuery({
  query: EventOptionsQuery,
  variables: computed(() => ({ orgId: orgId.value })),
})
const search = useQuery({
  query: CertificatesSearchQuery,
  variables: computed(() => ({
    where: certificatesWhere(orgId.value, filters),
    limit: PAGE_SIZE,
    offset: page.value * PAGE_SIZE,
    orderBy: [{ created_at: 'desc' as const }],
  })),
})
const restoreMutation = useMutation(RevokeCertificateMutation)

const rows = computed(() => search.data.value?.certificates ?? [])
const total = computed(() => search.data.value?.certificates_aggregate.aggregate?.count ?? 0)
const pageCount = computed(() => Math.ceil(total.value / PAGE_SIZE))

const eventOptions = computed(() => [
  { label: 'All events', value: '' },
  ...(eventsQuery.data.value?.events ?? []).map((e) => ({ label: e.name, value: e.id })),
])
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Valid', value: 'valid' },
  { label: 'Revoked', value: 'revoked' },
]

const revoking = ref<(typeof rows.value)[number] | null>(null)
const revokeOpen = ref(false)

function refresh() {
  search.executeQuery({ requestPolicy: 'network-only' })
}

function startRevoke(row: (typeof rows.value)[number]) {
  revoking.value = row
  revokeOpen.value = true
}

async function restore(id: string) {
  try {
    unwrap(await restoreMutation.executeMutation({ id, revokedAt: null, reason: null }))
    toast.success('Certificate restored.')
    refresh()
  } catch (error) {
    toast.error(errorMessage(error))
  }
}
</script>

<template>
  <PageTitle title="History" subtitle="Every certificate your organisation issued." />

  <section
    class="card grid items-end gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
  >
    <div class="sm:col-span-2 lg:col-span-1">
      <FormControl
        v-model="searchInput"
        variant="outline"
        type="search"
        label="Search"
        placeholder="Name, email or certificate ID"
      >
        <template #prefix>
          <span class="lucide-search size-4 text-ink-gray-5" aria-hidden="true" />
        </template>
      </FormControl>
    </div>
    <div>
      <Select v-model="filters.eventId" variant="outline" label="Event" :options="eventOptions" />
    </div>
    <div>
      <FormControl v-model="filters.from" variant="outline" type="date" label="From" />
    </div>
    <div>
      <FormControl v-model="filters.to" variant="outline" type="date" label="To" />
    </div>
    <div class="flex flex-col gap-1.5">
      <span class="text-xs text-ink-gray-5">Status</span>
      <TabButtons v-model="filters.status" :options="statusOptions" />
    </div>
  </section>

  <ErrorMessage v-if="search.error.value" :message="errorMessage(search.error.value)" />
  <LoadingText v-else-if="search.fetching.value && !search.data.value" />
  <template v-else>
    <p class="text-sm text-ink-gray-6">{{ plural(total, 'certificate') }}</p>
    <div class="card overflow-x-auto">
      <table class="data-table min-w-[48rem]">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Event</th>
            <th>Issued</th>
            <th>Status</th>
            <th><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="{ 'bg-bad-25': row.revoked_at }">
            <td>
              <div
                class="font-semibold"
                :class="row.recipient_name ? 'text-ink-gray-9' : 'text-ink-gray-5'"
              >
                {{ row.recipient_name ?? 'Locked (old data)' }}
              </div>
              <div class="text-xs text-ink-gray-6">
                {{ [row.recipient_email, row.rank].filter(Boolean).join(' · ') || '—' }}
              </div>
            </td>
            <td>
              <RouterLink
                v-if="row.batch?.event"
                :to="{ name: 'batch', params: { id: row.batch.id } }"
              >
                <TonePill :tone="toneFor(row.batch.event.id)" :label="row.batch.event.name" />
              </RouterLink>
            </td>
            <td class="text-ink-gray-7">{{ formatDate(row.created_at) }}</td>
            <td>
              <StatusBadge :status="row.revoked_at ? 'revoked' : 'valid'" />
              <div v-if="row.revoked_reason" class="mt-1 text-xs text-bad-700">
                {{ row.revoked_reason }}
              </div>
            </td>
            <td>
              <div class="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  theme="blue"
                  label="Verify page"
                  :href="`/verify/${row.id}`"
                />
                <template v-if="isAdmin">
                  <Button
                    v-if="row.revoked_at"
                    variant="outline"
                    label="Restore"
                    @click="restore(row.id)"
                  />
                  <Button
                    v-else
                    variant="ghost"
                    theme="red"
                    label="Revoke"
                    @click="startRevoke(row)"
                  />
                </template>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="5" class="!py-10 text-center text-ink-gray-5">No certificates match.</td>
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
  </template>

  <RevokeDialog v-model:open="revokeOpen" :certificate="revoking" @done="refresh" />
</template>
