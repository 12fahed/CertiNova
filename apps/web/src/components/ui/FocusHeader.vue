<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ title: string; eyebrow?: string; back: RouteLocationRaw }>()
</script>

<template>
  <header
    class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-edge bg-surface-base px-4 py-3 sm:px-5"
  >
    <div class="flex min-w-0 items-center gap-3">
      <RouterLink
        :to="back"
        class="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-gray-2 text-ink-gray-7 hover:bg-surface-gray-3"
        aria-label="Back"
      >
        <span class="lucide-chevron-left size-4" aria-hidden="true" />
      </RouterLink>
      <div class="min-w-0">
        <div v-if="eyebrow" class="truncate text-xs text-ink-gray-6">{{ eyebrow }}</div>
        <div class="truncate text-base font-bold text-ink-gray-9">{{ title }}</div>
      </div>
    </div>
    <slot name="center" />
    <div class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
