<script setup lang="ts">
import IconTile from './IconTile.vue'
import type { Tone } from './tones'

withDefaults(
  defineProps<{
    label: string
    value: number | string
    icon?: string
    tone?: Tone
    hint?: string
  }>(),
  { icon: undefined, tone: 'brand', hint: undefined },
)
</script>

<template>
  <div class="card flex items-center gap-4 p-4">
    <IconTile v-if="icon" :icon="icon" :tone="tone" />
    <div class="min-w-0">
      <div class="text-sm text-ink-gray-6">{{ label }}</div>
      <div class="text-h1 font-bold tabular-nums text-ink-gray-9">
        {{ typeof value === 'number' ? value.toLocaleString('en-GB') : value }}
      </div>
      <div v-if="hint" class="truncate text-xs text-ink-gray-5">{{ hint }}</div>
      <slot />
    </div>
  </div>
</template>
