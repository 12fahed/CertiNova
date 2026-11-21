<script setup lang="ts">
defineProps<{ icon: string; title: string; description?: string }>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-outline-gray-3 px-6 py-10 text-center"
  >
    <span :class="[icon, 'size-6 text-ink-gray-5']" aria-hidden="true" />
    <div class="flex flex-col gap-1">
      <p class="font-medium text-ink-gray-9">{{ title }}</p>
      <p v-if="description" class="max-w-md text-p-sm text-ink-gray-6">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
