<script setup lang="ts">
import { useMutation } from '@urql/vue'
import {
  Button,
  ErrorMessage,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  Switch,
  toast,
} from 'frappe-ui'
import { reactive, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
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
  <PageHeader>
    <PageHeaderTitle title="Organisation settings" />
  </PageHeader>

  <EmptyState
    v-if="!isAdmin"
    icon="lucide-lock"
    title="Only owners and admins can change settings"
  />
  <form v-else class="flex max-w-lg flex-col gap-5" @submit.prevent="save.run()">
    <FormControl
      v-model="form.name"
      label="Organisation name"
      description="Shown on new certificates and on the verify page."
      required
      minlength="2"
      maxlength="100"
    />
    <FormControl
      :model-value="org?.slug"
      label="Short name"
      disabled
      description="You cannot change it."
    />
    <Switch
      v-model="form.showNameOnVerify"
      padded
      label="Show recipient names on the verify page"
      description="When off, the verify page confirms the certificate but hides the name. It never shows the email."
    />
    <ErrorMessage :message="save.error" />
    <div>
      <Button type="submit" variant="solid" label="Save" :loading="save.loading" />
    </div>
  </form>
</template>
