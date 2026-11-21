<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, ErrorMessage, FormControl, Switch, toast } from 'frappe-ui'
import { reactive, watch } from 'vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import { UpdateOrganizationMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import { loadMemberships, useCurrentOrg } from '@/org/currentOrg'

const { org, isAdmin } = useCurrentOrg()
const updateOrg = useMutation(UpdateOrganizationMutation)
const form = reactive({ name: '', showNameOnVerify: true })

watch(
  org,
  (value) => {
    form.name = value?.name ?? ''
    form.showNameOnVerify = value?.show_name_on_verify ?? true
  },
  { immediate: true },
)

const save = useTask(async () => {
  if (!org.value) return
  unwrap(
    await updateOrg.executeMutation({
      id: org.value.id,
      name: form.name.trim(),
      showNameOnVerify: form.showNameOnVerify,
    }),
  )
  await loadMemberships(true)
  toast.success('Settings saved.')
})
</script>

<template>
  <PageTitle
    title="Settings"
    subtitle="How your organisation appears on certificates and the verify page."
  />

  <EmptyState
    v-if="!isAdmin"
    icon="lucide-lock"
    tone="neutral"
    title="Only owners and admins can change settings"
  />
  <form v-else class="card flex max-w-2xl flex-col gap-5 p-5" @submit.prevent="save.run()">
    <FormControl
      v-model="form.name"
      variant="outline"
      label="Organisation name"
      description="Shown on new certificates and on the verify page."
      required
      minlength="2"
      maxlength="100"
    />
    <FormControl
      variant="outline"
      :model-value="org?.slug"
      label="Short name"
      disabled
      description="You cannot change it."
    />
    <div class="rounded-lg border border-edge p-1">
      <Switch
        v-model="form.showNameOnVerify"
        padded
        label="Show recipient names on the verify page"
        description="When off, the verify page confirms the certificate but hides the name. It never shows the email."
      />
    </div>
    <ErrorMessage :message="save.error" />
    <div>
      <Button
        type="submit"
        variant="solid"
        theme="blue"
        size="md"
        label="Save changes"
        :loading="save.loading"
      />
    </div>
  </form>
</template>
