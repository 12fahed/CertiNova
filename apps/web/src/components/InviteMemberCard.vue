<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, ErrorMessage, FormControl, toast } from 'frappe-ui'
import { ref } from 'vue'
import { InviteMemberMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'

const emit = defineEmits<{ invited: [] }>()

const { orgId } = useCurrentOrg()
const inviteMember = useMutation(InviteMemberMutation)
const email = ref('')
const role = ref<'member' | 'admin'>('member')
const ROLES = [
  { value: 'member', label: 'Member', detail: 'Makes and sends certificates' },
  { value: 'admin', label: 'Admin', detail: 'Also manages events, designs and people' },
] as const

const invite = useTask(async () => {
  const address = email.value.trim()
  unwrap(
    await inviteMember.executeMutation({ orgId: orgId.value, email: address, role: role.value }),
  )
  toast.success(`Invite sent to ${address}.`)
  email.value = ''
  role.value = 'member'
  emit('invited')
})
</script>

<template>
  <form class="card flex flex-col gap-4 p-4" @submit.prevent="invite.run()">
    <h2 class="font-semibold text-ink-gray-9">Invite a person</h2>
    <FormControl
      v-model="email"
      variant="outline"
      label="Email"
      type="email"
      placeholder="name@example.com"
      required
    />
    <fieldset class="flex flex-col gap-1.5">
      <legend class="mb-1.5 text-xs text-ink-gray-5">Role</legend>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="option in ROLES"
          :key="option.value"
          class="flex cursor-pointer flex-col gap-0.5 rounded-lg border-[1.5px] p-3 text-sm focus-within:ring-2 focus-within:ring-brand-200"
          :class="
            role === option.value
              ? 'border-brand-600 bg-brand-50 text-brand-800'
              : 'border-edge text-ink-gray-9 hover:border-edge-strong'
          "
        >
          <input
            v-model="role"
            type="radio"
            name="invite-role"
            :value="option.value"
            class="sr-only"
          />
          <span class="font-semibold">{{ option.label }}</span>
          <span
            class="text-xs"
            :class="role === option.value ? 'text-brand-700' : 'text-ink-gray-6'"
          >
            {{ option.detail }}
          </span>
        </label>
      </div>
    </fieldset>
    <ErrorMessage :message="invite.error" />
    <Button
      type="submit"
      variant="solid"
      theme="blue"
      size="md"
      label="Send invite"
      :loading="invite.loading"
    />
    <p class="text-xs text-ink-gray-5">
      The link works for 7 days and only for this email address.
    </p>
  </form>
</template>
