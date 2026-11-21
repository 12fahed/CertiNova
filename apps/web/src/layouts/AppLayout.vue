<script setup lang="ts">
import {
  DesktopShell,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarCollapseToggle,
} from 'frappe-ui'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UnlockLegacyBanner from '@/components/UnlockLegacyBanner.vue'
import { useSession } from '@/auth/session'
import { supabase } from '@/lib/supabase'
import { selectOrg, useCurrentOrg } from '@/org/currentOrg'

const router = useRouter()
const { user } = useSession()
const { memberships, org, role, isAdmin } = useCurrentOrg()

const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Member' } as const

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
      { label: 'Log out', icon: 'lucide-log-out', onClick: logOut },
    ],
  },
])

async function logOut() {
  await supabase.auth.signOut()
  await router.push({ name: 'login' })
}
</script>

<template>
  <DesktopShell>
    <template #sidebar>
      <Sidebar>
        <SidebarHeader
          :title="org?.name ?? 'CertiNova'"
          :subtitle="role ? ROLE_LABELS[role] : undefined"
          :menu-items="orgMenu"
        />
        <div class="flex-1 overflow-y-auto">
          <SidebarItem
            label="Dashboard"
            icon="lucide-layout-dashboard"
            :route="{ name: 'dashboard' }"
          />
          <SidebarItem label="History" icon="lucide-history" :route="{ name: 'history' }" />
          <SidebarLabel>Organisation</SidebarLabel>
          <SidebarItem label="Members" icon="lucide-users" :route="{ name: 'members' }" />
          <SidebarItem
            v-if="isAdmin"
            label="Settings"
            icon="lucide-settings"
            :route="{ name: 'org-settings' }"
          />
        </div>
        <div
          class="hidden truncate px-2 pb-1 text-xs text-ink-gray-5 sm:block"
          :title="user?.email"
        >
          {{ user?.email }}
        </div>
        <SidebarCollapseToggle />
      </Sidebar>
    </template>

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
      <UnlockLegacyBanner />
      <RouterView :key="org?.id" />
    </div>
  </DesktopShell>
</template>
