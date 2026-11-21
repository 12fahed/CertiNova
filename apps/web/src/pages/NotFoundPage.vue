<script setup lang="ts">
import { Button } from 'frappe-ui'
import BrandMark from '@/components/ui/BrandMark.vue'
</script>

<template>
  <main
    class="flex min-h-full flex-col items-center justify-center gap-5 bg-canvas px-4 text-center"
  >
    <BrandMark />
    <p class="text-display font-black text-brand-600">404</p>
    <h1 class="text-h1 font-bold text-ink-gray-9">Page not found</h1>
    <p class="max-w-sm text-p-base text-ink-gray-6">The link is wrong, or the page was moved.</p>
    <Button
      variant="solid"
      theme="blue"
      size="md"
      label="Go to the home page"
      :route="{ name: 'home' }"
    />
  </main>
</template>
