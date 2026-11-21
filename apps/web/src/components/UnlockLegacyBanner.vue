<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Alert, Button, Dialog, ErrorMessage, FormControl, toast } from 'frappe-ui'
import { computed, ref } from 'vue'
import { LockedLegacyCountQuery, UnlockLegacyDataMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { plural } from '@/lib/format'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'

const { orgId, isOwner } = useCurrentOrg()
const locked = useQuery({
  query: LockedLegacyCountQuery,
  variables: computed(() => ({ orgId: orgId.value })),
})
const unlockMutation = useMutation(UnlockLegacyDataMutation)

const count = computed(() => locked.data.value?.certificates_aggregate.aggregate?.count ?? 0)
const open = ref(false)
const password = ref('')

function openUnlock() {
  open.value = true
}

const unlock = useTask(async () => {
  const data = unwrap(
    await unlockMutation.executeMutation({ orgId: orgId.value, password: password.value }),
  )
  const result = data.unlock_legacy_data
  open.value = false
  password.value = ''
  toast.success(`Unlocked ${plural(result.unlocked_certificates, 'certificate')}.`)
  locked.executeQuery({ requestPolicy: 'network-only' })
})
</script>

<template>
  <template v-if="count > 0">
    <Alert
      theme="amber"
      title="Old certificates are locked"
      :description="
        isOwner
          ? `${plural(count, 'certificate')} from the old CertiNova are locked. Unlock them one time with the password you used on the old app.`
          : `${plural(count, 'certificate')} from the old CertiNova are locked. Ask the owner of the organisation to unlock them.`
      "
      :primary-action="isOwner ? { label: 'Unlock', onClick: openUnlock } : undefined"
    />
    <Dialog v-model:open="open" title="Unlock old certificates" size="md">
      <form id="unlock-form" class="flex flex-col gap-4" @submit.prevent="unlock.run()">
        <p class="text-p-sm text-ink-gray-7">
          The old app locked recipient names with your password. Type the password you used on the
          old app. We use it one time and do not keep it.
        </p>
        <FormControl
          v-model="password"
          variant="outline"
          label="Old password"
          type="password"
          autocomplete="current-password"
          required
        />
        <ErrorMessage :message="unlock.error" />
      </form>
      <template #actions>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" @click="open = false" />
          <Button
            type="submit"
            form="unlock-form"
            variant="solid"
            theme="blue"
            label="Unlock"
            :loading="unlock.loading"
          />
        </div>
      </template>
    </Dialog>
  </template>
</template>
