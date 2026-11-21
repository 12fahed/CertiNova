import { computed, ref, shallowRef } from 'vue'
import { MyMembershipsQuery } from '@/graphql/operations/orgs'
import type { MyMembershipsQuery as MyMemberships } from '@/graphql/generated/graphql'
import { unwrap } from '@/lib/errors'
import { graphqlClient } from '@/lib/graphql'
import { onAuthEvent, useSession } from '@/auth/session'

export type Membership = MyMemberships['organization_members'][number]
export type OrgRole = Membership['role']

const STORAGE_KEY = 'certinova.current-org'

const memberships = shallowRef<Membership[]>([])
const selectedId = ref<string | null>(readStoredId())
let loadedFor: string | null = null

function readStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeId(id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked; the choice then lasts for this tab only.
  }
}

onAuthEvent((event) => {
  if (event === 'SIGNED_OUT') {
    memberships.value = []
    loadedFor = null
    selectOrg(null)
  }
})

/** Loads the signed-in user's organisations. Pass force after a membership change. */
export async function loadMemberships(force = false): Promise<Membership[]> {
  const userId = useSession().user.value?.id
  if (!userId) return []
  if (!force && loadedFor === userId) return memberships.value

  const result = await graphqlClient
    .query(MyMembershipsQuery, { userId }, { requestPolicy: 'network-only' })
    .toPromise()
  memberships.value = unwrap(result).organization_members
  loadedFor = userId
  return memberships.value
}

export function selectOrg(id: string | null): void {
  selectedId.value = id
  storeId(id)
}

const current = computed<Membership | null>(() => {
  const list = memberships.value
  return list.find((m) => m.organization.id === selectedId.value) ?? list[0] ?? null
})

export function useCurrentOrg() {
  return {
    memberships,
    membership: current,
    org: computed(() => current.value?.organization ?? null),
    /** The current org id. Only use it on pages behind the requiresOrg guard. */
    orgId: computed(() => current.value?.organization.id ?? ''),
    role: computed<OrgRole | null>(() => current.value?.role ?? null),
    isAdmin: computed(() => current.value?.role === 'owner' || current.value?.role === 'admin'),
    isOwner: computed(() => current.value?.role === 'owner'),
  }
}
