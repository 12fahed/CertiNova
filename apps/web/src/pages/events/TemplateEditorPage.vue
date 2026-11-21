<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText, TabButtons, toast } from 'frappe-ui'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CertificatePreview from '@/components/CertificatePreview.vue'
import FocusHeader from '@/components/ui/FocusHeader.vue'
import FieldStylePanel from '@/editor/FieldStylePanel.vue'
import { FIELD_COLORS } from '@/editor/fieldColors'
import TemplateCanvas from '@/editor/TemplateCanvas.vue'
import { clampBox, type Size } from '@/editor/geometry'
import {
  imageProblem,
  readImageSize,
  scaleFields,
  uploadTemplateImage,
} from '@/editor/templateImage'
import {
  CreateTemplateMutation,
  EventQuery,
  FontsQuery,
  ReplaceTemplateMutation,
} from '@/graphql/operations/events'
import { errorMessage, unwrap } from '@/lib/errors'
import { signedUrl, BUCKETS } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'
import {
  buildLayout,
  FIELD_KEYS,
  FIELD_LABELS,
  type Box,
  type FieldKey,
  type TemplateField,
} from '@/rendering/layout'
import { verifyUrl } from '@/rendering/preview'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { org, orgId } = useCurrentOrg()
const eventQuery = useQuery({ query: EventQuery, variables: computed(() => ({ id: props.id })) })
const fontsQuery = useQuery({ query: FontsQuery, variables: {} })
const createTemplate = useMutation(CreateTemplateMutation)
const replaceTemplate = useMutation(ReplaceTemplateMutation)

const event = computed(() => eventQuery.data.value?.events_by_pk ?? null)
const fonts = computed(() => fontsQuery.data.value?.fonts ?? [])
const renderFamilies = computed(() => new Map(fonts.value.map((f) => [f.family, f.render_family])))

const imageUrl = ref<string | null>(null)
const imageSize = ref<Size | null>(null)
const imageFile = shallowRef<File | null>(null)
const fields = ref<TemplateField[]>([])
const selected = ref<FieldKey | null>(null)
const placing = ref<FieldKey | null>(null)
const mode = ref<'edit' | 'preview'>('edit')
const dirty = ref(false)
const fileInput = ref<HTMLInputElement>()
const uploadError = ref<string>()

const DEFAULT_STYLE = {
  font_family: 'Inter',
  font_weight: 'normal',
  font_style: 'normal',
  text_decoration: 'none',
  color: '#000000',
} as const

let loaded = false
watch(
  event,
  async (value) => {
    if (loaded || !value) return
    loaded = true
    const template = value.template
    if (!template) return
    imageSize.value = { width: template.image_width, height: template.image_height }
    fields.value = template.fields.map((f) => ({ ...f }))
    imageUrl.value = await signedUrl(BUCKETS.templates, template.image_path)
  },
  { immediate: true },
)

let objectUrl: string | null = null
onBeforeUnmount(() => objectUrl && URL.revokeObjectURL(objectUrl))

async function onFile(eventInput: Event) {
  const input = eventInput.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  uploadError.value = imageProblem(file) ?? undefined
  if (uploadError.value) return

  const url = URL.createObjectURL(file)
  try {
    const size = await readImageSize(url)
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    objectUrl = url
    if (imageSize.value) fields.value = scaleFields(fields.value, imageSize.value, size)
    imageSize.value = size
    imageUrl.value = url
    imageFile.value = file
    dirty.value = true
  } catch (error) {
    URL.revokeObjectURL(url)
    uploadError.value = errorMessage(error)
  }
}

const selectedField = computed(
  () => fields.value.find((f) => f.field_key === selected.value) ?? null,
)

function fieldFor(key: FieldKey): TemplateField | undefined {
  return fields.value.find((f) => f.field_key === key)
}

function place(key: FieldKey, box: Box) {
  const existing = fieldFor(key)
  if (existing) Object.assign(existing, box)
  else fields.value.push({ field_key: key, ...DEFAULT_STYLE, ...box })
  placing.value = null
  selected.value = key
  dirty.value = true
}

function update(key: FieldKey, patch: Partial<TemplateField>) {
  const field = fieldFor(key)
  if (!field || !imageSize.value) return
  Object.assign(field, patch)
  Object.assign(field, clampBox(field, imageSize.value))
  dirty.value = true
}

function remove(key: FieldKey) {
  fields.value = fields.value.filter((f) => f.field_key !== key)
  if (selected.value === key) selected.value = null
  dirty.value = true
}

function startPlacing(key: FieldKey) {
  if (fieldFor(key)) {
    selected.value = key
    return
  }
  mode.value = 'edit'
  placing.value = placing.value === key ? null : key
}

const canSave = computed(
  () => imageSize.value !== null && fieldFor('recipient_name') !== undefined && dirty.value,
)

const save = useTask(async () => {
  const value = event.value
  const size = imageSize.value
  if (!value || !size) return
  const existing = value.template
  const imagePath = imageFile.value
    ? await uploadTemplateImage(orgId.value, imageFile.value)
    : existing?.image_path
  if (!imagePath) throw new Error('Upload the certificate image first.')

  const image = { image_path: imagePath, image_width: size.width, image_height: size.height }
  const rows = fields.value.map((field) => ({ ...field }))
  if (existing) {
    unwrap(
      await replaceTemplate.executeMutation({
        id: existing.id,
        set: image,
        fields: rows.map((row) => ({ ...row, template_id: existing.id })),
      }),
    )
  } else {
    unwrap(
      await createTemplate.executeMutation({
        object: { ...image, org_id: orgId.value, event_id: value.id, fields: { data: rows } },
      }),
    )
  }
  dirty.value = false
  imageFile.value = null
  toast.success('Design saved.')
  await router.push({ name: 'event', params: { id: value.id } })
})

onBeforeRouteLeave(() => !dirty.value || window.confirm('Leave without saving the design?'))

const previewLayout = computed(() =>
  imageSize.value
    ? buildLayout(imageSize.value, org.value?.name ?? '', fields.value, renderFamilies.value)
    : null,
)
const SAMPLE_ID = '00000000-0000-4000-8000-000000000000'
const sample = {
  certificateId: SAMPLE_ID,
  recipientName: 'Aarav Mehta',
  rank: '1st Place',
  verifyUrl: verifyUrl(SAMPLE_ID),
}
</script>

<template>
  <ErrorMessage
    v-if="eventQuery.error.value"
    class="m-6"
    :message="errorMessage(eventQuery.error.value)"
  />
  <LoadingText v-else-if="!event" class="m-6" />
  <template v-else>
    <FocusHeader
      :back="{ name: 'event', params: { id: event.id } }"
      :eyebrow="event.name"
      title="Certificate design"
    >
      <template v-if="imageUrl && imageSize" #center>
        <TabButtons
          v-model="mode"
          :options="[
            { label: 'Edit', value: 'edit' },
            { label: 'Preview', value: 'preview' },
          ]"
        />
      </template>
      <template #actions>
        <Button
          v-if="imageUrl"
          variant="outline"
          icon-left="lucide-image-up"
          label="Replace image"
          @click="fileInput?.click()"
        />
        <Button
          variant="solid"
          theme="blue"
          label="Save design"
          :disabled="!canSave"
          :loading="save.loading"
          @click="save.run()"
        />
      </template>
    </FocusHeader>

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      class="hidden"
      @change="onFile"
    />

    <ErrorMessage
      v-if="save.error ?? uploadError"
      class="mx-5 mt-4"
      :message="save.error ?? uploadError"
    />

    <div v-if="!imageUrl || !imageSize" class="grid flex-1 place-items-center p-6">
      <div
        class="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-brand-200 bg-brand-50 px-6 py-14 text-center"
      >
        <span class="grid size-12 place-items-center rounded-xl bg-brand-100" aria-hidden="true">
          <span class="lucide-image-up size-6 text-brand-600" />
        </span>
        <p class="text-lg font-semibold text-ink-gray-9">Upload the certificate image</p>
        <p class="max-w-md text-p-sm text-ink-gray-6">
          PNG, JPEG or WebP, up to 10 MB. Use a large image (for example 2000 px wide) for sharp
          print.
        </p>
        <Button
          variant="solid"
          theme="blue"
          size="md"
          label="Choose image"
          @click="fileInput?.click()"
        />
      </div>
    </div>

    <div v-else class="flex flex-1 flex-wrap">
      <aside
        class="flex w-full flex-col gap-1 border-b border-edge bg-surface-base p-3 lg:w-60 lg:border-b-0 lg:border-r"
      >
        <div class="section-label px-2.5 pb-1.5">Fields</div>
        <button
          v-for="key in FIELD_KEYS"
          :key="key"
          type="button"
          class="flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm"
          :class="
            selected === key || placing === key
              ? 'border-brand-200 bg-brand-100 font-semibold text-brand-800'
              : fieldFor(key)
                ? 'border-transparent text-ink-gray-8 hover:bg-canvas'
                : 'border-dashed border-edge-strong text-ink-gray-8 hover:bg-canvas'
          "
          @click="startPlacing(key)"
        >
          <span class="size-2.5 rounded-sm" :class="FIELD_COLORS[key].dot" aria-hidden="true" />
          {{ FIELD_LABELS[key] }}
          <span v-if="fieldFor(key)" class="lucide-check ml-auto size-4 text-good-600" />
          <span v-else class="ml-auto text-xs font-semibold text-brand-700">+ Place</span>
        </button>
        <p class="mt-3 rounded-lg bg-canvas p-2.5 text-xs leading-relaxed text-ink-gray-6">
          Pick a field, then drag on the image. Arrow keys nudge a box. Delete removes it. The
          recipient name is required.
        </p>
      </aside>

      <main
        class="editor-stage flex min-w-0 flex-[999_1_480px] flex-col items-center gap-3 p-5 sm:p-7"
      >
        <p
          v-if="placing && mode === 'edit'"
          class="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          Drag on the image to place the {{ FIELD_LABELS[placing].toLowerCase() }} box.
        </p>
        <div class="w-full max-w-4xl bg-surface-base shadow-lift">
          <TemplateCanvas
            v-if="mode === 'edit'"
            :image-url="imageUrl"
            :image="imageSize"
            :fields="fields"
            :selected="selected"
            :placing="placing"
            @select="selected = $event"
            @place="place"
            @change="(key, box) => update(key, box)"
            @remove="remove"
          />
          <CertificatePreview
            v-else-if="previewLayout"
            :image-url="imageUrl"
            :layout="previewLayout"
            :data="sample"
          />
        </div>
        <span
          class="rounded-full border border-edge bg-surface-base px-3 py-1 text-xs text-ink-gray-6"
        >
          {{ imageSize.width }} × {{ imageSize.height }} px<template v-if="mode === 'preview'">
            · sample data</template
          >
        </span>
      </main>

      <aside
        class="w-full border-t border-edge bg-surface-base p-4 lg:w-72 lg:border-l lg:border-t-0"
      >
        <FieldStylePanel
          v-if="selectedField"
          :field="selectedField"
          :fonts="fonts"
          @update="(patch) => update(selectedField!.field_key, patch)"
          @remove="remove(selectedField.field_key)"
        />
        <p v-else class="text-p-sm text-ink-gray-6">
          Select a field to change its font and colour.
        </p>
      </aside>
    </div>
  </template>
</template>

<style scoped>
.editor-stage {
  background-color: #eef2f7;
  background-image: radial-gradient(#d5dce7 1px, transparent 1px);
  background-size: 16px 16px;
}
</style>
