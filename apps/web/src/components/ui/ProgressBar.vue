<script setup lang="ts">
import { computed } from 'vue'
import { TONES, type Tone } from './tones'

const props = withDefaults(defineProps<{ value: number; total: number; tone?: Tone }>(), {
  tone: 'brand',
})
const percent = computed(() =>
  props.total > 0 ? Math.min(100, Math.round((props.value / props.total) * 100)) : 0,
)
</script>

<template>
  <div
    class="h-1.5 overflow-hidden rounded-full bg-edge-soft"
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full transition-[width]"
      :class="TONES[tone].dot"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>
