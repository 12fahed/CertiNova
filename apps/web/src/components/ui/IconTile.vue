<script setup lang="ts">
import { TONES, type Tone } from './tones'

withDefaults(defineProps<{ icon: string; tone?: Tone; size?: 'sm' | 'md' }>(), {
  tone: 'brand',
  size: 'md',
})
</script>

<template>
  <span
    class="grid shrink-0 place-items-center"
    :class="[TONES[tone].icon, size === 'md' ? 'size-11 rounded-xl' : 'size-9 rounded-lg']"
    aria-hidden="true"
  >
    <span :class="[icon, size === 'md' ? 'size-5' : 'size-[18px]']" />
  </span>
</template>
