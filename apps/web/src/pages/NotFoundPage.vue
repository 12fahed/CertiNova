<script setup lang="ts">
import { Button } from 'frappe-ui'
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
    <p class="text-sm font-medium text-ink-gray-5">404</p>
    <h1 class="text-2xl font-semibold text-ink-gray-9">Page not found</h1>
    <p class="max-w-sm text-p-base text-ink-gray-6">The link is wrong, or the page was moved.</p>
    <Button variant="solid" label="Go to the home page" :route="{ name: 'home' }" />
  </main>
</template>
