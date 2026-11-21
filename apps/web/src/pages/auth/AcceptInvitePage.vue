<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, ErrorMessage, LoadingText } from 'frappe-ui'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSession } from '@/auth/session'
import { AcceptInviteMutation } from '@/graphql/operations/orgs'
import { unwrap } from '@/lib/errors'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'
import { loadMemberships, selectOrg } from '@/org/currentOrg'

const route = useRoute()
const router = useRouter()
const { user } = useSession()
const acceptInvite = useMutation(AcceptInviteMutation)

const accept = useTask(async () => {
  const token = route.query.token
  if (typeof token !== 'string' || !token) throw new Error('This invite link is not complete.')
  const data = unwrap(await acceptInvite.executeMutation({ token }))
  await loadMemberships(true)
  selectOrg(data.accept_invite.org_id)
  await router.replace({ name: 'dashboard' })
})

async function switchAccount() {
  await supabase.auth.signOut()
  await router.replace({ name: 'login', query: { redirect: route.fullPath } })
}

onMounted(() => accept.run())
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-h1 font-bold text-ink-gray-9">Join an organisation</h1>
    <LoadingText v-if="accept.loading" text="Accepting the invite…" />
    <template v-else-if="accept.error">
      <ErrorMessage :message="accept.error" />
      <p class="text-p-sm text-ink-gray-7">
        You are logged in as <b>{{ user?.email }}</b>. The invite must be for this email.
      </p>
      <div class="flex gap-2">
        <Button variant="solid" theme="blue" label="Use another account" @click="switchAccount" />
        <Button label="Go to dashboard" :route="{ name: 'dashboard' }" />
      </div>
    </template>
  </div>
</template>
