<script setup lang="ts">
import { Button } from 'frappe-ui'
import { useSession } from '@/auth/session'
import BrandMark from '@/components/ui/BrandMark.vue'
import { LINKS } from '@/pages/public/legal'

const { isSignedIn } = useSession()
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-full flex-col bg-surface-base">
    <header class="sticky top-0 z-10 border-b border-edge-soft bg-surface-base/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <RouterLink :to="{ name: 'home' }"><BrandMark /></RouterLink>
        <nav class="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Button
            v-if="isSignedIn"
            variant="solid"
            theme="blue"
            label="Dashboard"
            :route="{ name: 'dashboard' }"
          />
          <template v-else>
            <Button variant="ghost" label="Log in" :route="{ name: 'login' }" />
            <Button variant="solid" theme="blue" label="Sign up" :route="{ name: 'signup' }" />
          </template>
        </nav>
      </div>
    </header>

    <main class="flex-1 bg-canvas">
      <RouterView />
    </main>

    <footer class="border-t border-edge-soft bg-surface-base">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-ink-gray-6 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <span>© {{ year }} CertiNova</span>
        <nav class="flex flex-wrap gap-4" aria-label="Footer">
          <RouterLink class="link" :to="{ name: 'privacy' }">Privacy policy</RouterLink>
          <RouterLink class="link" :to="{ name: 'terms' }">Terms</RouterLink>
          <a class="link" :href="LINKS.github" target="_blank" rel="noopener">GitHub</a>
          <a class="link" :href="LINKS.discord" target="_blank" rel="noopener">Discord</a>
        </nav>
      </div>
    </footer>
  </div>
</template>
