<script setup lang="ts">
import { computed } from 'vue'
import { initials, TONES, toneFor, type Tone } from './tones'

const props = withDefaults(
  defineProps<{ name: string; tone?: Tone; size?: 'sm' | 'md'; square?: boolean }>(),
  { tone: undefined, size: 'md', square: false },
)
const tone = computed(() => props.tone ?? toneFor(props.name))
</script>

<template>
  <span
    class="inline-grid shrink-0 place-items-center font-bold"
    :class="[
      TONES[tone].soft,
      size === 'md' ? 'size-9 text-xs' : 'size-7 text-[11px]',
      square ? 'rounded-lg' : 'rounded-full',
    ]"
    aria-hidden="true"
  >
    {{ initials(name) }}
  </span>
</template>
