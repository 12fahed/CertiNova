import { useQuery } from '@urql/vue'
import { computed, type ComputedRef } from 'vue'
import { FeatureFlagsQuery } from '@/graphql/operations/orgs'
import { useCurrentOrg } from '@/org/currentOrg'

/** Same rule as public.feature_enabled: the org value if set, else the global value, else off. */
export function useFeatureFlag(key: string): ComputedRef<boolean> {
  const { orgId } = useCurrentOrg()
  const flags = useQuery({ query: FeatureFlagsQuery, variables: { key } })
  return computed(() => {
    const rows = flags.data.value?.feature_flags ?? []
    const own = rows.find((row) => row.org_id === orgId.value)
    const global = rows.find((row) => row.org_id === null)
    return (own ?? global)?.enabled ?? false
  })
}
