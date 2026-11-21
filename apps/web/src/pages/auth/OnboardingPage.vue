<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, ErrorMessage, FormControl } from 'frappe-ui'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { BootstrapOrgMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'
import { loadMemberships, selectOrg } from '@/org/currentOrg'
import { slugify, slugProblem } from '@/org/slug'

const router = useRouter()
const bootstrap = useMutation(BootstrapOrgMutation)
const name = ref('')
const slug = ref('')
const slugEdited = ref(false)

watch(name, (value) => {
  if (!slugEdited.value) slug.value = slugify(value)
})

const create = useTask(async () => {
  const problem = slugProblem(slug.value)
  if (problem) throw new Error(`Web address: ${problem}`)
  const data = unwrap(
    await bootstrap.executeMutation({ name: name.value.trim(), slug: slug.value }),
  )
  await loadMemberships(true)
  selectOrg(data.bootstrap_org.org_id)
  await router.replace({ name: 'dashboard' })
})

async function logOut() {
  await supabase.auth.signOut()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="create.run()">
    <h1 class="text-xl font-semibold text-ink-gray-9">Create your organisation</h1>
    <p class="text-p-sm text-ink-gray-7">
      Certificates are issued in the name of the organisation. You can invite your team later.
    </p>
    <FormControl v-model="name" label="Organisation name" required minlength="2" maxlength="100" />
    <FormControl
      v-model="slug"
      label="Short name"
      description="Lowercase letters, digits and hyphens. It must be unique."
      required
      @input="slugEdited = true"
    />
    <ErrorMessage :message="create.error" />
    <Button type="submit" variant="solid" label="Create organisation" :loading="create.loading" />
    <p class="text-sm text-ink-gray-6">
      To join a team, open the invite link from your email.
      <button type="button" class="underline hover:text-ink-gray-9" @click="logOut">Log out</button>
    </p>
  </form>
</template>
