<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { Button, ErrorMessage, LoadingText } from 'frappe-ui'
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

const details = computed(() => {
  const value = result.value
  if (!value) return []
  return [
    { label: 'Organisation', value: value.organisation_name },
    { label: 'Issued by', value: value.issuer_name },
    { label: 'Event', value: value.event_name },
    { label: 'Event date', value: formatDate(value.event_date) },
    { label: 'Issued on', value: formatDate(value.issued_at) },
    ...(value.rank ? [{ label: 'Rank', value: value.rank }] : []),
  ]
})
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
    <header class="flex flex-col gap-1">
      <span class="text-xs font-medium uppercase tracking-wide text-ink-gray-5">
        Certificate verification
      </span>
      <p class="break-all font-mono text-sm text-ink-gray-6">ID: {{ id }}</p>
    </header>

    <LoadingText v-if="loading" text="Checking the certificate…" />
    <ErrorMessage v-else-if="verify.error.value" :message="errorMessage(verify.error.value)" />

    <section
      v-else-if="!result"
      class="flex flex-col items-start gap-3 rounded-lg border border-outline-red-2 bg-surface-red-1 p-6"
    >
      <h1 class="flex items-center gap-2 text-xl font-semibold text-ink-red-6">
        <span class="lucide-circle-x size-5" aria-hidden="true" />
        Certificate not found
      </h1>
      <p class="text-p-base text-ink-gray-7">
        No certificate has this ID. Check the link or scan the QR code again.
      </p>
      <Button label="Go to CertiNova" :route="{ name: 'home' }" />
    </section>

    <template v-else>
      <section
        class="flex flex-col gap-4 rounded-lg border p-6"
        :class="
          result.is_revoked
            ? 'border-outline-red-2 bg-surface-red-1'
            : 'border-outline-green-2 bg-surface-green-1'
        "
      >
        <h1
          class="flex items-center gap-2 text-xl font-semibold"
          :class="result.is_revoked ? 'text-ink-red-6' : 'text-ink-green-6'"
        >
          <span
            :class="[result.is_revoked ? 'lucide-ban' : 'lucide-badge-check', 'size-5']"
            aria-hidden="true"
          />
          {{ result.is_revoked ? 'This certificate was revoked' : 'Certificate verified' }}
        </h1>
        <p v-if="result.recipient_name" class="text-2xl font-semibold text-ink-gray-9">
          {{ result.recipient_name }}
        </p>
        <p v-else class="text-p-sm text-ink-gray-6">
          The issuer does not show recipient names on this page.
        </p>
        <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div v-for="item in details" :key="item.label">
            <dt class="text-xs text-ink-gray-5">{{ item.label }}</dt>
            <dd class="text-ink-gray-9">{{ item.value }}</dd>
          </div>
        </dl>
        <p v-if="result.is_revoked" class="text-p-sm text-ink-gray-7">
          The issuer revoked this certificate. It is no longer valid.
        </p>
      </section>

      <figure v-if="previewUrl" class="overflow-hidden rounded-lg border border-outline-gray-2">
        <img :src="previewUrl" alt="Certificate image" class="block w-full" />
      </figure>
    </template>
  </div>
</template>
