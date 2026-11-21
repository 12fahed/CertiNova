<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, Dialog, ErrorMessage, Textarea } from 'frappe-ui'
import { ref, watch } from 'vue'
import { RevokeCertificateMutation } from '@/graphql/operations/batches'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'

const props = defineProps<{ certificate: { id: string; recipient_name?: string | null } | null }>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ done: [] }>()

const revokeMutation = useMutation(RevokeCertificateMutation)
const reason = ref('')

watch(open, (isOpen) => {
  if (isOpen) reason.value = ''
})

const revoke = useTask(async () => {
  if (!props.certificate) return
  unwrap(
    await revokeMutation.executeMutation({
      id: props.certificate.id,
      revokedAt: new Date().toISOString(),
      reason: reason.value.trim() || null,
    }),
  )
  open.value = false
  emit('done')
})
</script>

<template>
  <Dialog v-model:open="open" title="Revoke certificate" theme="red" icon="lucide-ban" size="md">
    <form id="revoke-form" class="flex flex-col gap-4" @submit.prevent="revoke.run()">
      <p class="text-p-sm text-ink-gray-7">
        The verify page will show that the certificate for
        <b>{{ certificate?.recipient_name ?? 'this recipient' }}</b> is revoked. You can restore it
        later.
      </p>
      <Textarea v-model="reason" label="Reason (optional)" maxlength="500" :rows="3" />
      <ErrorMessage :message="revoke.error" />
    </form>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" @click="open = false" />
        <Button
          type="submit"
          form="revoke-form"
          variant="solid"
          theme="red"
          label="Revoke"
          :loading="revoke.loading"
        />
      </div>
    </template>
  </Dialog>
</template>
