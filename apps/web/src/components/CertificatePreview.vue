<script setup lang="ts">
import { LoadingIndicator } from 'frappe-ui'
import { ref, shallowRef, watch } from 'vue'
import type { TemplateLayout } from '@/rendering/layout'
import { renderPreview, type CertificateData } from '@/rendering/preview'

const props = defineProps<{ imageUrl: string; layout: TemplateLayout; data: CertificateData }>()

const canvas = ref<HTMLCanvasElement>()
const background = shallowRef<HTMLImageElement | null>(null)
const failed = ref(false)

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The design image did not load.'))
    image.src = url
  })
}

watch(
  () => props.imageUrl,
  async (url) => {
    background.value = null
    failed.value = false
    try {
      background.value = await loadImage(url)
    } catch {
      failed.value = true
    }
  },
  { immediate: true },
)

let renderId = 0
watch(
  [canvas, background, () => props.layout, () => props.data],
  async () => {
    if (!canvas.value || !background.value) return
    // Fonts load async. Only the last render may draw, so quick edits do not flicker.
    const id = ++renderId
    const scratch = document.createElement('canvas')
    await renderPreview(scratch, background.value, props.layout, props.data)
    if (id !== renderId || !canvas.value) return
    canvas.value.width = scratch.width
    canvas.value.height = scratch.height
    canvas.value.getContext('2d')?.drawImage(scratch, 0, 0)
  },
  { deep: true },
)
</script>

<template>
  <div class="relative">
    <p v-if="failed" class="p-4 text-sm text-ink-red-6">The design image did not load.</p>
    <div v-else-if="!background" class="grid aspect-[1.414] place-items-center">
      <LoadingIndicator class="size-5" />
    </div>
    <canvas v-show="background" ref="canvas" class="block h-auto w-full" />
  </div>
</template>
