<script setup lang="ts">
import { Button } from 'frappe-ui'
import { computed, ref } from 'vue'
import { plural } from '@/lib/format'
import { readRecipientFile } from '@/recipients/readFile'
import {
  MAX_RECIPIENTS,
  validateRecipient,
  type Recipient,
  type RowError,
} from '@/recipients/recipients'

const recipients = defineModel<Recipient[]>({ required: true })
const selected = defineModel<number>('selected', { default: 0 })

const fileInput = ref<HTMLInputElement>()
const fileName = ref<string | null>(null)
const importedCount = ref(0)
const importErrors = ref<RowError[]>([])
const importing = ref(false)
const dragging = ref(false)

const rowErrors = computed(() => recipients.value.map(validateRecipient))
const full = computed(() => recipients.value.length >= MAX_RECIPIENTS)

function addRow() {
  recipients.value.push({ name: '', email: '', rank: '' })
  selected.value = recipients.value.length - 1
}

function removeRow(index: number) {
  recipients.value.splice(index, 1)
  selected.value = Math.min(selected.value, Math.max(recipients.value.length - 1, 0))
}

async function importFile(file: File) {
  importing.value = true
  try {
    const result = await readRecipientFile(file)
    fileName.value = file.name
    importedCount.value = Math.min(result.recipients.length, MAX_RECIPIENTS)
    importErrors.value = result.errors
    if (result.recipients.length > 0) {
      recipients.value = result.recipients.slice(0, MAX_RECIPIENTS)
      selected.value = 0
    }
  } finally {
    importing.value = false
  }
}

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) void importFile(file)
}

function onDrop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) void importFile(file)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      class="flex flex-wrap items-center gap-4 rounded-xl border-[1.5px] border-dashed p-4 transition-colors"
      :class="dragging ? 'border-brand-600 bg-brand-100' : 'border-brand-200 bg-brand-50'"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <span class="grid size-11 place-items-center rounded-xl bg-brand-100" aria-hidden="true">
        <span class="lucide-file-up size-5 text-brand-600" />
      </span>
      <div class="min-w-48 flex-1">
        <div class="font-semibold text-ink-gray-9">Drop a CSV or XLSX file</div>
        <div class="text-sm text-ink-gray-6">
          Columns: name (required), email, rank.
          <a class="link" href="/sample-recipients.csv" download>Sample file</a>
        </div>
      </div>
      <Button
        variant="solid"
        theme="blue"
        label="Choose file"
        :loading="importing"
        @click="fileInput?.click()"
      />
      <input
        ref="fileInput"
        type="file"
        accept=".csv,.xlsx,text/csv"
        class="hidden"
        @change="onFile"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span
        v-if="fileName"
        class="inline-flex items-center gap-2 rounded-full border border-edge bg-surface-base px-3 py-1 text-sm"
      >
        <span class="lucide-file-spreadsheet size-4 text-ink-gray-5" aria-hidden="true" />
        {{ fileName }}
        <span class="font-semibold text-good-700">{{ importedCount }} imported</span>
        <span v-if="importErrors.length" class="font-semibold text-bad-700">
          {{ importErrors.length }} skipped
        </span>
      </span>
      <Button
        variant="ghost"
        theme="blue"
        icon-left="lucide-plus"
        label="Add row"
        :disabled="full"
        @click="addRow"
      />
      <span class="ml-auto text-sm text-ink-gray-6">
        {{ plural(recipients.length, 'recipient') }} of {{ MAX_RECIPIENTS }}
      </span>
    </div>

    <details v-if="importErrors.length" class="rounded-lg bg-bad-50 px-3 py-2 text-sm text-bad-800">
      <summary class="cursor-pointer font-medium">See the skipped rows</summary>
      <ul class="mt-1 max-h-32 list-disc overflow-y-auto pl-5">
        <li v-for="error in importErrors" :key="`${error.row}-${error.message}`">
          Row {{ error.row }}: {{ error.message }}
        </li>
      </ul>
    </details>

    <div class="card max-h-[28rem] overflow-auto">
      <table class="data-table min-w-[36rem]">
        <thead class="sticky top-0 z-[1]">
          <tr>
            <th class="w-10">#</th>
            <th>Name *</th>
            <th>Email</th>
            <th>Rank</th>
            <th class="w-10"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(recipient, index) in recipients"
            :key="index"
            :class="
              rowErrors[index]
                ? 'bg-bad-25'
                : index === selected
                  ? 'bg-brand-50 shadow-[inset_3px_0_0_theme(colors.brand.600)]'
                  : ''
            "
            @focusin="selected = index"
          >
            <td class="!py-1 text-xs tabular-nums text-ink-gray-5">{{ index + 1 }}</td>
            <td class="!p-1">
              <input
                v-model.trim="recipient.name"
                class="cell-input"
                :aria-label="`Name, row ${index + 1}`"
                :aria-invalid="rowErrors[index] !== null"
              />
            </td>
            <td class="!p-1">
              <input
                v-model.trim="recipient.email"
                type="email"
                class="cell-input"
                :aria-label="`Email, row ${index + 1}`"
              />
              <div v-if="rowErrors[index]" class="px-1.5 pb-1 text-xs text-bad-700">
                {{ rowErrors[index] }}
              </div>
            </td>
            <td class="!p-1">
              <input
                v-model.trim="recipient.rank"
                class="cell-input"
                :aria-label="`Rank, row ${index + 1}`"
              />
            </td>
            <td class="!p-1">
              <Button
                variant="ghost"
                icon="lucide-x"
                :label="`Remove row ${index + 1}`"
                @click="removeRow(index)"
              />
            </td>
          </tr>
          <tr v-if="recipients.length === 0">
            <td colspan="5" class="!py-8 text-center text-ink-gray-5">
              Import a file or add rows by hand.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cell-input {
  @apply w-full rounded-md border-0 bg-transparent px-1.5 py-1 text-sm text-ink-gray-9 focus:bg-surface-base focus:ring-1 focus:ring-brand-600;
}
</style>
