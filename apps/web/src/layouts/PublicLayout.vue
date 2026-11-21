<script setup lang="ts">
import { Button } from 'frappe-ui'
import { useSession } from '@/auth/session'
import BrandMark from '@/components/BrandMark.vue'

const { isSignedIn } = useSession()
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-outline-gray-1">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <RouterLink :to="{ name: 'home' }"><BrandMark /></RouterLink>
        <div class="flex items-center gap-2">
          <Button
            v-if="isSignedIn"
            variant="solid"
            label="Dashboard"
            :route="{ name: 'dashboard' }"
          />
          <template v-else>
            <Button variant="ghost" label="Log in" :route="{ name: 'login' }" />
            <Button variant="solid" label="Sign up" :route="{ name: 'signup' }" />
          </template>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t border-outline-gray-1">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-gray-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <span>© {{ year }} CertiNova</span>
        <nav class="flex gap-4">
          <RouterLink class="hover:text-ink-gray-8" :to="{ name: 'privacy' }"
            >Privacy policy</RouterLink
          >
          <RouterLink class="hover:text-ink-gray-8" :to="{ name: 'terms' }"
            >Terms and conditions</RouterLink
          >
        </nav>
      </div>
    </footer>
  </div>
</template>
