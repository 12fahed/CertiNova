<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Box, FieldKey, TemplateField } from '@/rendering/layout'
import { FIELD_LABELS } from '@/rendering/layout'
import { FIELD_COLORS } from './fieldColors'
import {
  boxFromPoints,
  boxStyle,
  clampBox,
  MIN_BOX_SIZE,
  moveBox,
  resizeBox,
  toNatural,
  type Point,
  type Size,
} from './geometry'

const props = defineProps<{
  imageUrl: string
  image: Size
  fields: readonly TemplateField[]
  selected: FieldKey | null
  /** The field the next drag on the image places. */
  placing: FieldKey | null
}>()

const emit = defineEmits<{
  select: [key: FieldKey | null]
  place: [key: FieldKey, box: Box]
  change: [key: FieldKey, box: Box]
  remove: [key: FieldKey]
}>()

const stage = ref<HTMLDivElement>()
const draft = ref<Box | null>(null)

type Gesture =
  | { kind: 'draw'; key: FieldKey; start: Point }
  | { kind: 'move' | 'resize'; key: FieldKey; start: Point; box: Box }
let gesture: Gesture | null = null

function pointerToNatural(event: PointerEvent): Point {
  const rect = stage.value!.getBoundingClientRect()
  return toNatural(
    { x: event.clientX - rect.left, y: event.clientY - rect.top },
    { width: rect.width, height: rect.height },
    props.image,
  )
}

function startDraw(event: PointerEvent) {
  if (!props.placing) {
    emit('select', null)
    return
  }
  const start = pointerToNatural(event)
  gesture = { kind: 'draw', key: props.placing, start }
  draft.value = { ...start, width: 0, height: 0 }
  stage.value!.setPointerCapture(event.pointerId)
}

function startEdit(event: PointerEvent, field: TemplateField, kind: 'move' | 'resize') {
  event.stopPropagation()
  emit('select', field.field_key)
  gesture = {
    kind,
    key: field.field_key,
    start: pointerToNatural(event),
    box: { x: field.x, y: field.y, width: field.width, height: field.height },
  }
  stage.value!.setPointerCapture(event.pointerId)
}

function onMove(event: PointerEvent) {
  if (!gesture) return
  const point = pointerToNatural(event)
  if (gesture.kind === 'draw') {
    draft.value = boxFromPoints(gesture.start, point)
    return
  }
  const delta = { x: point.x - gesture.start.x, y: point.y - gesture.start.y }
  const next =
    gesture.kind === 'move'
      ? moveBox(gesture.box, delta, props.image)
      : resizeBox(gesture.box, delta, props.image)
  emit('change', gesture.key, next)
}

function onUp() {
  if (gesture?.kind === 'draw' && draft.value) {
    const drawn = draft.value
    // A click without a drag places a default-size box centred on the click.
    const box =
      drawn.width < MIN_BOX_SIZE || drawn.height < MIN_BOX_SIZE
        ? defaultBox(gesture.key, gesture.start)
        : drawn
    emit('place', gesture.key, clampBox(box, props.image))
  }
  gesture = null
  draft.value = null
}

function defaultBox(key: FieldKey, centre: Point): Box {
  const width = key === 'certificate_qr' ? props.image.height * 0.2 : props.image.width * 0.4
  const height = key === 'certificate_qr' ? width : props.image.height * 0.08
  return { x: centre.x - width / 2, y: centre.y - height / 2, width, height }
}

function onKey(event: KeyboardEvent, field: TemplateField) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    emit('remove', field.field_key)
    return
  }
  const step = event.shiftKey ? 10 : 1
  const moves: Record<string, Point> = {
    ArrowLeft: { x: -step, y: 0 },
    ArrowRight: { x: step, y: 0 },
    ArrowUp: { x: 0, y: -step },
    ArrowDown: { x: 0, y: step },
  }
  const delta = moves[event.key]
  if (!delta) return
  event.preventDefault()
  emit('change', field.field_key, moveBox(field, delta, props.image))
}

const cursor = computed(() => (props.placing ? 'cursor-crosshair' : 'cursor-default'))
</script>

<template>
  <div
    ref="stage"
    class="relative select-none touch-none"
    :class="cursor"
    @pointerdown="startDraw"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
  >
    <img :src="imageUrl" alt="Certificate design" class="block w-full" draggable="false" />
    <button
      v-for="field in fields"
      :key="field.field_key"
      type="button"
      class="absolute cursor-move rounded-sm border-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-5"
      :class="[
        FIELD_COLORS[field.field_key].box,
        selected === field.field_key ? 'border-solid' : 'border-dashed',
      ]"
      :style="boxStyle(field, image)"
      :aria-label="`${FIELD_LABELS[field.field_key]}. Arrow keys move it, Delete removes it.`"
      @pointerdown="startEdit($event, field, 'move')"
      @keydown="onKey($event, field)"
    >
      <span
        :class="FIELD_COLORS[field.field_key].dot"
        class="pointer-events-none absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 text-2xs font-semibold text-white"
      >
        {{ FIELD_LABELS[field.field_key] }}
      </span>
      <span
        v-if="selected === field.field_key"
        class="absolute -bottom-1.5 -right-1.5 size-3 cursor-se-resize rounded-sm border-2 border-brand-600 bg-white"
        aria-hidden="true"
        @pointerdown="startEdit($event, field, 'resize')"
      />
    </button>
    <div
      v-if="draft"
      class="pointer-events-none absolute border-2 border-dashed border-outline-gray-5"
      :style="boxStyle(draft, image)"
    />
  </div>
</template>
