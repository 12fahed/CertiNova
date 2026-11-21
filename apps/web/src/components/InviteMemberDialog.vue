<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, Dialog, ErrorMessage, FormControl, Select, toast } from 'frappe-ui'
import { ref, watch } from 'vue'
import { InviteMemberMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ invited: [] }>()

const { orgId } = useCurrentOrg()
const inviteMember = useMutation(InviteMemberMutation)
const email = ref('')
const role = ref<'member' | 'admin'>('member')
const ROLES = [
  { label: 'Member: makes and sends certificates', value: 'member' },
  { label: 'Admin: also manages events, designs and people', value: 'admin' },
]

watch(open, (isOpen) => {
  if (!isOpen) return
  email.value = ''
  role.value = 'member'
  invite.error = undefined
})

const invite = useTask(async () => {
  unwrap(
    await inviteMember.executeMutation({
      orgId: orgId.value,
      email: email.value.trim(),
      role: role.value,
    }),
  )
  toast.success(`Invite sent to ${email.value.trim()}.`)
  open.value = false
  emit('invited')
})
</script>

<template>
  <Dialog v-model:open="open" title="Invite a person" size="md">
    <form id="invite-form" class="flex flex-col gap-4" @submit.prevent="invite.run()">
      <p class="text-p-sm text-ink-gray-7">
        They get an email with a link. The link works for 7 days and only for this email address.
      </p>
      <FormControl v-model="email" label="Email" type="email" required />
      <Select v-model="role" label="Role" :options="ROLES" />
      <ErrorMessage :message="invite.error" />
    </form>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" @click="open = false" />
        <Button
          type="submit"
          form="invite-form"
          variant="solid"
          label="Send invite"
          :loading="invite.loading"
        />
      </div>
    </template>
  </Dialog>
</template>
