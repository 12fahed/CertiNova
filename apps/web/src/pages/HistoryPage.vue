<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import {
  Button,
  ErrorMessage,
  FormControl,
  LoadingText,
  PageHeader,
  PageHeaderTitle,
  Select,
  toast,
} from 'frappe-ui'
import { computed, reactive, ref, watch } from 'vue'
import RevokeDialog from '@/components/RevokeDialog.vue'
import StatusBadge from '@/components/StatusBadge.vue'
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
  <PageHeader>
    <PageHeaderTitle title="History" />
  </PageHeader>

  <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr]">
    <FormControl
      v-model="searchInput"
      type="search"
      label="Search"
      placeholder="Name, email or certificate ID"
    />
    <Select v-model="filters.eventId" label="Event" :options="eventOptions" />
    <FormControl v-model="filters.from" type="date" label="From" />
    <FormControl v-model="filters.to" type="date" label="To" />
    <Select v-model="filters.status" label="Status" :options="statusOptions" />
  </div>

  <ErrorMessage v-if="search.error.value" :message="errorMessage(search.error.value)" />
  <LoadingText v-else-if="search.fetching.value && !search.data.value" />
  <template v-else>
    <p class="text-sm text-ink-gray-6">{{ plural(total, 'certificate') }}</p>
    <div class="overflow-x-auto rounded-lg border border-outline-gray-2">
      <table class="w-full min-w-[48rem] text-sm">
        <thead class="bg-surface-gray-1 text-left text-xs text-ink-gray-6">
          <tr>
            <th class="px-3 py-2 font-medium">Name</th>
            <th class="px-3 py-2 font-medium">Email</th>
            <th class="px-3 py-2 font-medium">Event</th>
            <th class="px-3 py-2 font-medium">Issued</th>
            <th class="px-3 py-2 font-medium">Status</th>
            <th class="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="border-t border-outline-gray-1">
            <td class="px-3 py-2 text-ink-gray-9">
              {{ row.recipient_name ?? 'Locked' }}
              <span v-if="row.rank" class="text-ink-gray-5">· {{ row.rank }}</span>
            </td>
            <td class="px-3 py-2 text-ink-gray-7">{{ row.recipient_email ?? '—' }}</td>
            <td class="px-3 py-2">
              <RouterLink
                v-if="row.batch?.event"
                class="text-ink-gray-7 underline hover:text-ink-gray-9"
                :to="{ name: 'batch', params: { id: row.batch.id } }"
              >
                {{ row.batch.event.name }}
              </RouterLink>
            </td>
            <td class="px-3 py-2 text-ink-gray-7">{{ formatDate(row.created_at) }}</td>
            <td class="px-3 py-2">
              <StatusBadge
                :status="row.revoked_at ? 'revoked' : 'done'"
                :title="row.revoked_reason ?? undefined"
              />
            </td>
            <td class="px-3 py-2">
              <div class="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  icon="lucide-shield-check"
                  label="Open verify page"
                  tooltip="Open verify page"
                  :href="`/verify/${row.id}`"
                />
                <template v-if="isAdmin">
                  <Button
                    v-if="row.revoked_at"
                    variant="ghost"
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
            <td colspan="6" class="px-3 py-8 text-center text-ink-gray-5">
              No certificates match.
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
  </template>

  <RevokeDialog v-model:open="revokeOpen" :certificate="revoking" @done="refresh" />
</template>
