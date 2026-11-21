<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText, toast } from 'frappe-ui'
import { computed } from 'vue'
import { VerifyCertificateQuery, VerifyPreviewUrlQuery } from '@/graphql/operations/verify'
import { errorMessage } from '@/lib/errors'
import { formatDate } from '@/lib/format'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const props = defineProps<{ id: string }>()
const validId = computed(() => UUID.test(props.id))
const variables = computed(() => ({ certificateId: props.id.toLowerCase() }))
const pause = computed(() => !validId.value)

const verify = useQuery({ query: VerifyCertificateQuery, variables, pause })
const preview = useQuery({ query: VerifyPreviewUrlQuery, variables, pause })

const result = computed(() => verify.data.value?.verify_certificate[0] ?? null)
const previewUrl = computed(() => preview.data.value?.get_verify_preview_url?.url ?? null)
const loading = computed(() => validId.value && verify.fetching.value && !verify.data.value)

async function copyId() {
  try {
    await navigator.clipboard.writeText(props.id)
    toast.success('Certificate ID copied.')
  } catch {
    toast.error('Could not copy. Select the ID and copy it by hand.')
  }
}

const details = computed(() => {
  const value = result.value
  if (!value) return []
  return [
    { label: 'Event', value: value.event_name },
    ...(value.rank ? [{ label: 'Rank', value: value.rank }] : []),
    { label: 'Issued by', value: value.issuer_name },
    { label: 'Organisation', value: value.organisation_name },
    { label: 'Event date', value: formatDate(value.event_date) },
    { label: 'Issued on', value: formatDate(value.issued_at) },
  ]
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
    <LoadingText v-if="loading" text="Checking the certificate…" />
    <ErrorMessage v-else-if="verify.error.value" :message="errorMessage(verify.error.value)" />

    <section
      v-else-if="!result"
      class="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-edge bg-surface-base px-6 py-12 text-center"
    >
      <span class="grid size-14 place-items-center rounded-full bg-bad-50" aria-hidden="true">
        <span class="lucide-circle-x size-7 text-bad-600" />
      </span>
      <h1 class="text-h1 font-bold text-ink-gray-9">Certificate not found</h1>
      <p class="max-w-sm text-p-base text-ink-gray-6">
        No certificate has this ID. Check the link or scan the QR code again.
      </p>
      <p class="break-all font-mono text-xs text-ink-gray-5">{{ id }}</p>
      <Button variant="outline" label="Go to CertiNova" :route="{ name: 'home' }" />
    </section>

    <div v-else class="flex flex-wrap items-start gap-6">
      <section class="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
        <div
          class="flex flex-col gap-4 rounded-2xl p-6 text-white"
          :class="result.is_revoked ? 'bg-bad-700' : 'bg-good-700'"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid size-11 shrink-0 place-items-center rounded-full bg-white"
              aria-hidden="true"
            >
              <span
                :class="[
                  result.is_revoked ? 'lucide-ban text-bad-700' : 'lucide-check text-good-700',
                  'size-6',
                ]"
              />
            </span>
            <div>
              <h1 class="text-xl font-bold">
                {{ result.is_revoked ? 'This certificate was revoked' : 'Certificate verified' }}
              </h1>
              <p class="text-sm text-white/80">
                {{
                  result.is_revoked
                    ? 'The issuer revoked it. It is no longer valid.'
                    : `Issued by ${result.organisation_name} on CertiNova`
                }}
              </p>
            </div>
          </div>
          <div class="border-t border-white/20 pt-4">
            <template v-if="result.recipient_name">
              <div class="text-xs text-white/80">Awarded to</div>
              <div class="text-h1 font-bold">{{ result.recipient_name }}</div>
            </template>
            <p v-else class="text-sm text-white/90">
              The issuer does not show recipient names on this page.
            </p>
          </div>
        </div>

        <dl class="card grid grid-cols-2 gap-4 p-5">
          <div v-for="item in details" :key="item.label">
            <dt class="text-xs text-ink-gray-6">{{ item.label }}</dt>
            <dd class="mt-0.5 font-semibold text-ink-gray-9">{{ item.value }}</dd>
          </div>
          <div
            class="col-span-2 flex items-center justify-between gap-3 rounded-lg bg-canvas px-3 py-2.5"
          >
            <div class="min-w-0">
              <dt class="text-xs text-ink-gray-6">Certificate ID</dt>
              <dd class="truncate font-mono text-sm text-ink-gray-9">{{ id }}</dd>
            </div>
            <Button variant="outline" icon-left="lucide-copy" label="Copy" @click="copyId" />
          </div>
        </dl>
      </section>

      <figure v-if="previewUrl" class="card m-0 min-w-0 flex-[1.4_1_440px] overflow-hidden p-4">
        <img :src="previewUrl" alt="Certificate image" class="block w-full" />
      </figure>
    </div>
  </div>
</template>
