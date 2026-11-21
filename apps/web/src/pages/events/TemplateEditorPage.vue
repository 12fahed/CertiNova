<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import {
  Alert,
  Button,
  ErrorMessage,
  LoadingText,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
  toast,
} from 'frappe-ui'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CertificatePreview from '@/components/CertificatePreview.vue'
import FieldStylePanel from '@/editor/FieldStylePanel.vue'
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
  <ErrorMessage v-if="eventQuery.error.value" :message="errorMessage(eventQuery.error.value)" />
  <LoadingText v-else-if="!event" />
  <template v-else>
    <PageHeader>
      <PageHeaderTitle :title="`Design · ${event.name}`" />
      <div class="flex items-center gap-2">
        <Button label="Cancel" :route="{ name: 'event', params: { id: event.id } }" />
        <Button
          variant="solid"
          label="Save design"
          :disabled="!canSave"
          :loading="save.loading"
          @click="save.run()"
        />
      </div>
    </PageHeader>

    <ErrorMessage :message="save.error ?? uploadError" />

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      class="hidden"
      @change="onFile"
    />

    <div
      v-if="!imageUrl || !imageSize"
      class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-outline-gray-3 px-6 py-16 text-center"
    >
      <span class="lucide-image-up size-6 text-ink-gray-5" aria-hidden="true" />
      <p class="font-medium text-ink-gray-9">Upload the certificate image</p>
      <p class="max-w-md text-p-sm text-ink-gray-6">
        PNG, JPEG or WebP, up to 10 MB. Use a large image (for example 2000 px wide) for sharp
        print.
      </p>
      <Button variant="solid" label="Choose image" @click="fileInput?.click()" />
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-[1fr_18rem]">
      <div class="flex min-w-0 flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <TabButtons
            v-model="mode"
            :options="[
              { label: 'Edit', value: 'edit' },
              { label: 'Preview', value: 'preview' },
            ]"
          />
          <Button icon-left="lucide-image-up" label="Replace image" @click="fileInput?.click()" />
        </div>
        <Alert
          v-if="placing && mode === 'edit'"
          theme="blue"
          :title="`Drag on the image to place the ${FIELD_LABELS[placing].toLowerCase()} box.`"
        />
        <div class="overflow-hidden rounded-lg border border-outline-gray-2">
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
        <p class="text-xs text-ink-gray-5">
          Image size {{ imageSize.width }} × {{ imageSize.height }} px. The preview uses sample
          data.
        </p>
      </div>

      <aside class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <h2 class="font-medium text-ink-gray-9">Fields</h2>
          <Button
            v-for="key in FIELD_KEYS"
            :key="key"
            class="justify-start"
            :variant="selected === key || placing === key ? 'solid' : 'subtle'"
            :icon-left="fieldFor(key) ? 'lucide-check' : 'lucide-plus'"
            :label="FIELD_LABELS[key]"
            @click="startPlacing(key)"
          />
          <p class="text-xs text-ink-gray-5">The recipient name is required.</p>
        </div>
        <FieldStylePanel
          v-if="selectedField"
          :field="selectedField"
          :fonts="fonts"
          @update="(patch) => update(selectedField!.field_key, patch)"
          @remove="remove(selectedField.field_key)"
        />
      </aside>
    </div>
  </template>
</template>
