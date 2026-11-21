<script setup lang="ts">
import { Dropdown } from 'frappe-ui'
import { computed } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useSession } from '@/auth/session'
import InitialsAvatar from '@/components/ui/InitialsAvatar.vue'
import { initials } from '@/components/ui/tones'
import { supabase } from '@/lib/supabase'
import { selectOrg, useCurrentOrg } from '@/org/currentOrg'

const router = useRouter()
const { user } = useSession()
const { memberships, org, role, isAdmin } = useCurrentOrg()

const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Member' } as const

interface NavItem {
  label: string
  icon: string
  to: RouteLocationRaw
  /** Route names that keep this item active, such as an event below the dashboard. */
  match: string[]
}

const main: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'lucide-layout-dashboard',
    to: { name: 'dashboard' },
    match: ['dashboard', 'event', 'batch'],
  },
  { label: 'History', icon: 'lucide-history', to: { name: 'history' }, match: ['history'] },
]
const organisation = computed<NavItem[]>(() => [
  { label: 'Members', icon: 'lucide-users', to: { name: 'members' }, match: ['members'] },
  ...(isAdmin.value
    ? [
        {
          label: 'Settings',
          icon: 'lucide-settings',
          to: { name: 'org-settings' },
          match: ['org-settings'],
        },
      ]
    : []),
])

const orgMenu = computed(() => [
  {
    group: 'Organisations',
    options: memberships.value.map((m) => ({
      label: m.organization.name,
      icon: m.organization.id === org.value?.id ? 'lucide-check' : 'lucide-building-2',
      onClick: () => {
        selectOrg(m.organization.id)
        void router.push({ name: 'dashboard' })
      },
    })),
  },
  {
    group: 'Account',
    options: [
      {
        label: 'New organisation',
        icon: 'lucide-plus',
        onClick: () => router.push({ name: 'onboarding' }),
      },
    ],
  },
])

function isActive(item: NavItem): boolean {
  return item.match.includes(String(router.currentRoute.value.name))
}

async function logOut() {
  await supabase.auth.signOut()
  await router.push({ name: 'login' })
}
</script>

<template>
  <aside
    class="flex h-full w-16 shrink-0 flex-col gap-5 border-r border-edge bg-surface-base px-2 py-4 md:w-64 md:px-3"
  >
    <Dropdown :options="orgMenu" align="start">
      <template #trigger>
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-xl border border-edge p-1.5 text-left hover:bg-canvas md:p-2"
          :aria-label="`Organisation: ${org?.name ?? ''}. Switch organisation`"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {{ initials(org?.name ?? 'CertiNova') }}
          </span>
          <span class="hidden min-w-0 flex-1 md:block">
            <span class="block truncate text-sm font-semibold text-ink-gray-9">{{
              org?.name
            }}</span>
            <span class="block text-xs text-ink-gray-6">{{ role ? ROLE_LABELS[role] : '' }}</span>
          </span>
          <span
            class="lucide-chevrons-up-down hidden size-4 text-ink-gray-5 md:block"
            aria-hidden="true"
          />
        </button>
      </template>
    </Dropdown>

    <nav class="flex flex-col gap-0.5" aria-label="Main">
      <RouterLink
        v-for="item in main"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        :class="{ 'nav-item-active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        :title="item.label"
      >
        <span :class="[item.icon, 'size-[18px] shrink-0']" aria-hidden="true" />
        <span class="hidden md:inline">{{ item.label }}</span>
      </RouterLink>
      <div class="section-label hidden px-2.5 pb-1.5 pt-5 md:block">Organisation</div>
      <div class="my-3 border-t border-edge md:hidden" />
      <RouterLink
        v-for="item in organisation"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        :class="{ 'nav-item-active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        :title="item.label"
      >
        <span :class="[item.icon, 'size-[18px] shrink-0']" aria-hidden="true" />
        <span class="hidden md:inline">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="mt-auto flex flex-col items-center gap-2 border-t border-edge pt-3 md:flex-row">
      <InitialsAvatar :name="user?.email ?? '?'" tone="good" size="sm" />
      <span
        class="hidden min-w-0 flex-1 truncate text-sm text-ink-gray-7 md:block"
        :title="user?.email"
      >
        {{ user?.email }}
      </span>
      <button
        type="button"
        class="grid size-8 place-items-center rounded-lg text-ink-gray-5 hover:bg-canvas hover:text-ink-gray-9"
        aria-label="Log out"
        title="Log out"
        @click="logOut"
      >
        <span class="lucide-log-out size-4" aria-hidden="true" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.nav-item {
  @apply flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-gray-7 hover:bg-canvas hover:text-ink-gray-9 md:justify-start;
}

.nav-item-active {
  @apply bg-brand-100 font-semibold text-brand-800 hover:bg-brand-100 hover:text-brand-800;
}
</style>
