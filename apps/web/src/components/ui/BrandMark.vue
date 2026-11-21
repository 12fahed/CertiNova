<script setup lang="ts">
withDefaults(defineProps<{ inverted?: boolean }>(), { inverted: false })
</script>

<template>
  <span
    class="inline-flex items-center gap-2.5 text-[17px] font-bold"
    :class="inverted ? 'text-white' : 'text-ink-gray-9'"
  >
    <span
      class="grid size-8 place-items-center rounded-lg text-sm"
      :class="inverted ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'"
      aria-hidden="true"
    >
      C
    </span>
    CertiNova
  </span>
</template>
