<script setup lang="ts">
defineProps<{ label: string; value: number; hint?: string }>()
</script>

<template>
  <div class="rounded-lg border border-outline-gray-2 p-4">
    <div class="text-sm text-ink-gray-6">{{ label }}</div>
    <div class="mt-1 text-2xl font-semibold tabular-nums text-ink-gray-9">
      {{ value.toLocaleString('en-GB') }}
    </div>
    <div v-if="hint" class="mt-1 text-xs text-ink-gray-5">{{ hint }}</div>
  </div>
</template>
