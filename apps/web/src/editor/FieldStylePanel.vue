<script setup lang="ts">
import { Button, FormControl, Select } from 'frappe-ui'
import { computed } from 'vue'
import { FIELD_LABELS, type TemplateField } from '@/rendering/layout'

export interface FontOption {
  family: string
  category: string
}

const props = defineProps<{ field: TemplateField; fonts: readonly FontOption[] }>()
const emit = defineEmits<{ update: [patch: Partial<TemplateField>]; remove: [] }>()

const isText = computed(() => props.field.field_key !== 'certificate_qr')
const fontOptions = computed(() =>
  props.fonts.map((font) => ({
    label: font.family,
    value: font.family,
    description: font.category,
  })),
)

const toggles = computed(
  () =>
    [
      {
        label: 'Bold',
        icon: 'lucide-bold',
        active: props.field.font_weight === 'bold',
        patch: { font_weight: props.field.font_weight === 'bold' ? 'normal' : 'bold' },
      },
      {
        label: 'Italic',
        icon: 'lucide-italic',
        active: props.field.font_style === 'italic',
        patch: { font_style: props.field.font_style === 'italic' ? 'normal' : 'italic' },
      },
      {
        label: 'Underline',
        icon: 'lucide-underline',
        active: props.field.text_decoration === 'underline',
        patch: {
          text_decoration: props.field.text_decoration === 'underline' ? 'none' : 'underline',
        },
      },
    ] as const,
)

const HEX = /^#[0-9a-fA-F]{6}$/

function setColor(value: string) {
  if (HEX.test(value)) emit('update', { color: value.toLowerCase() })
}

function setNumber(key: 'x' | 'y' | 'width' | 'height', value: string) {
  const number = Number(value)
  if (Number.isFinite(number) && number >= 0) emit('update', { [key]: number })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium text-ink-gray-9">{{ FIELD_LABELS[field.field_key] }}</h3>
      <Button
        variant="ghost"
        theme="red"
        icon="lucide-trash-2"
        label="Remove field"
        tooltip="Remove field"
        @click="emit('remove')"
      />
    </div>

    <template v-if="isText">
      <Select
        label="Font"
        :model-value="field.font_family"
        :options="fontOptions"
        @update:model-value="(value) => emit('update', { font_family: String(value) })"
      />
      <div class="flex gap-1" role="group" aria-label="Text style">
        <Button
          v-for="toggle in toggles"
          :key="toggle.label"
          :icon="toggle.icon"
          :label="toggle.label"
          :tooltip="toggle.label"
          :variant="toggle.active ? 'solid' : 'subtle'"
          :aria-pressed="toggle.active"
          @click="emit('update', toggle.patch)"
        />
      </div>
      <div class="flex items-end gap-2">
        <label class="flex flex-col gap-1.5 text-xs text-ink-gray-5">
          Colour
          <input
            type="color"
            class="h-7 w-10 cursor-pointer rounded border border-outline-gray-2 bg-surface-base"
            :value="field.color"
            @input="setColor(($event.target as HTMLInputElement).value)"
          />
        </label>
        <FormControl
          class="flex-1"
          :model-value="field.color"
          aria-label="Colour hex code"
          maxlength="7"
          @update:model-value="setColor"
        />
      </div>
    </template>
    <p v-else class="text-p-sm text-ink-gray-6">
      The QR code links to the public verify page. It fills 80% of the box and stays square.
    </p>

    <fieldset class="grid grid-cols-2 gap-2">
      <legend class="mb-1.5 text-xs text-ink-gray-5">Position in image pixels</legend>
      <FormControl
        v-for="key in ['x', 'y', 'width', 'height'] as const"
        :key="key"
        :label="
          key === 'x' || key === 'y' ? key.toUpperCase() : key[0]!.toUpperCase() + key.slice(1)
        "
        type="number"
        min="0"
        :model-value="Math.round(field[key])"
        @update:model-value="(value: string) => setNumber(key, value)"
      />
    </fieldset>
  </div>
</template>
