<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export interface Crumb {
  label: string
  to?: RouteLocationRaw
}

withDefaults(defineProps<{ title: string; subtitle?: string; crumbs?: Crumb[] }>(), {
  subtitle: undefined,
  crumbs: () => [],
})
</script>

<template>
  <header class="flex flex-col gap-2">
    <nav
      v-if="crumbs.length"
      aria-label="Breadcrumb"
      class="flex flex-wrap items-center gap-1.5 text-sm"
    >
      <template v-for="(crumb, index) in crumbs" :key="crumb.label">
        <span v-if="index > 0" class="text-ink-gray-4" aria-hidden="true">/</span>
        <RouterLink v-if="crumb.to" :to="crumb.to" class="text-brand-700 hover:text-brand-800">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="text-ink-gray-6">{{ crumb.label }}</span>
      </template>
    </nav>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex min-w-0 flex-col gap-2">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-h1 font-bold text-ink-gray-9">{{ title }}</h1>
          <slot name="badge" />
        </div>
        <p v-if="subtitle" class="text-p-sm text-ink-gray-6">{{ subtitle }}</p>
        <slot name="meta" />
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
