<script setup lang="ts">
import BrandMark from '@/components/BrandMark.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-surface-gray-1 px-4 py-10">
    <RouterLink :to="{ name: 'home' }" class="mb-8"><BrandMark /></RouterLink>
    <div
      class="w-full max-w-sm rounded-lg border border-outline-gray-2 bg-surface-base p-6 shadow-sm"
    >
      <RouterView />
    </div>
  </div>
</template>
