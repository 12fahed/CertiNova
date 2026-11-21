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
const importErrors = ref<RowError[]>([])
const importing = ref(false)

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

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  importing.value = true
  try {
    const result = await readRecipientFile(file)
    importErrors.value = result.errors
    if (result.recipients.length > 0) {
      recipients.value = result.recipients.slice(0, MAX_RECIPIENTS)
      selected.value = 0
    }
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <Button
        icon-left="lucide-file-up"
        label="Import CSV or XLSX"
        :loading="importing"
        @click="fileInput?.click()"
      />
      <Button icon-left="lucide-plus" label="Add row" :disabled="full" @click="addRow" />
      <a
        class="text-sm text-ink-gray-6 underline hover:text-ink-gray-9"
        href="/sample-recipients.csv"
        download
      >
        Sample file
      </a>
      <span class="ml-auto text-sm text-ink-gray-6">
        {{ plural(recipients.length, 'recipient') }} (at most {{ MAX_RECIPIENTS }})
      </span>
      <input
        ref="fileInput"
        type="file"
        accept=".csv,.xlsx,text/csv"
        class="hidden"
        @change="onFile"
      />
    </div>

    <div v-if="importErrors.length" class="rounded-md bg-surface-red-1 p-3 text-sm text-ink-red-6">
      <p class="font-medium">Some rows were not imported:</p>
      <ul class="mt-1 max-h-32 list-disc overflow-y-auto pl-5">
        <li v-for="error in importErrors" :key="`${error.row}-${error.message}`">
          Row {{ error.row }}: {{ error.message }}
        </li>
      </ul>
    </div>

    <div class="max-h-[28rem] overflow-auto rounded-lg border border-outline-gray-2">
      <table class="w-full min-w-[36rem] text-sm">
        <thead class="sticky top-0 bg-surface-gray-1 text-left text-xs text-ink-gray-6">
          <tr>
            <th class="w-10 px-2 py-2 font-medium">#</th>
            <th class="px-2 py-2 font-medium">Name *</th>
            <th class="px-2 py-2 font-medium">Email</th>
            <th class="px-2 py-2 font-medium">Rank</th>
            <th class="w-10" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(recipient, index) in recipients"
            :key="index"
            class="border-t border-outline-gray-1"
            :class="{ 'bg-surface-gray-1': index === selected }"
            @focusin="selected = index"
          >
            <td class="px-2 text-xs tabular-nums text-ink-gray-5">{{ index + 1 }}</td>
            <td class="p-1">
              <input
                v-model.trim="recipient.name"
                class="w-full rounded border-0 bg-transparent px-1.5 py-1 text-sm focus:bg-surface-base focus:ring-1 focus:ring-outline-gray-3"
                :aria-label="`Name, row ${index + 1}`"
                :aria-invalid="rowErrors[index] !== null"
              />
            </td>
            <td class="p-1">
              <input
                v-model.trim="recipient.email"
                type="email"
                class="w-full rounded border-0 bg-transparent px-1.5 py-1 text-sm focus:bg-surface-base focus:ring-1 focus:ring-outline-gray-3"
                :aria-label="`Email, row ${index + 1}`"
              />
            </td>
            <td class="p-1">
              <input
                v-model.trim="recipient.rank"
                class="w-full rounded border-0 bg-transparent px-1.5 py-1 text-sm focus:bg-surface-base focus:ring-1 focus:ring-outline-gray-3"
                :aria-label="`Rank, row ${index + 1}`"
              />
            </td>
            <td class="px-1">
              <Button
                variant="ghost"
                icon="lucide-x"
                :label="`Remove row ${index + 1}`"
                @click="removeRow(index)"
              />
            </td>
          </tr>
          <tr v-if="recipients.length === 0">
            <td colspan="5" class="px-3 py-8 text-center text-ink-gray-5">
              Import a file or add rows by hand.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="rowErrors.some((error) => error)" class="text-sm text-ink-red-6">
      Fix the rows with problems:
      {{
        rowErrors
          .map((error, index) => (error ? `row ${index + 1} (${error})` : null))
          .filter(Boolean)
          .slice(0, 5)
          .join(', ')
      }}
    </p>
  </div>
</template>
