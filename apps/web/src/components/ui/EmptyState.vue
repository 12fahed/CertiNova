<script setup lang="ts">
import IconTile from './IconTile.vue'
import type { Tone } from './tones'

withDefaults(defineProps<{ icon: string; title: string; description?: string; tone?: Tone }>(), {
  description: undefined,
  tone: 'brand',
})
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-edge-strong bg-surface-base px-6 py-10 text-center"
  >
    <IconTile :icon="icon" :tone="tone" />
    <div class="flex flex-col gap-1">
      <p class="font-semibold text-ink-gray-9">{{ title }}</p>
      <p v-if="description" class="max-w-md text-p-sm text-ink-gray-6">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
