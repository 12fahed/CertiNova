<script setup lang="ts">
import { TONES, type Tone } from './tones'

withDefaults(defineProps<{ tone?: Tone; label?: string; dot?: boolean }>(), {
  tone: 'neutral',
  label: undefined,
  dot: false,
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="TONES[tone].soft"
  >
    <span v-if="dot" class="size-1.5 rounded-full" :class="TONES[tone].dot" aria-hidden="true" />
    <slot>{{ label }}</slot>
  </span>
</template>
