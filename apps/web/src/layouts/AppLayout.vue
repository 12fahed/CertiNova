<script setup lang="ts">
import { DesktopShell } from 'frappe-ui'
import UnlockLegacyBanner from '@/components/UnlockLegacyBanner.vue'
import { useCurrentOrg } from '@/org/currentOrg'
import AppSidebar from './AppSidebar.vue'

const { org } = useCurrentOrg()
</script>

<template>
  <DesktopShell>
    <template #sidebar>
      <AppSidebar />
    </template>

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <UnlockLegacyBanner />
      <RouterView :key="org?.id" />
    </div>
  </DesktopShell>
</template>
