<script setup lang="ts">
import { Button, ErrorMessage, FormControl, toast } from 'frappe-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { passwordProblem } from '@/auth/password'
import { useSession } from '@/auth/session'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'

const router = useRouter()
const { isSignedIn } = useSession()
const password = ref('')
const confirm = ref('')

const save = useTask(async () => {
  const problem = passwordProblem(password.value)
  if (problem) throw new Error(problem)
  if (password.value !== confirm.value) throw new Error('The two passwords are not the same.')
  const { error } = await supabase.auth.updateUser({ password: password.value })
  if (error) throw error
  toast.success('Your password is changed.')
  await router.replace({ name: 'dashboard' })
})
</script>

<template>
  <div v-if="!isSignedIn" class="flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-ink-gray-9">Link not valid</h1>
    <p class="text-p-sm text-ink-gray-7">
      The link is old or was used already. Ask for a new link.
    </p>
    <Button variant="solid" label="Ask for a new link" :route="{ name: 'forgot-password' }" />
  </div>
  <form v-else class="flex flex-col gap-4" @submit.prevent="save.run()">
    <h1 class="text-xl font-semibold text-ink-gray-9">Set a new password</h1>
    <FormControl
      v-model="password"
      label="New password"
      type="password"
      autocomplete="new-password"
      description="8 or more characters, with letters and digits."
      required
    />
    <FormControl
      v-model="confirm"
      label="Type it again"
      type="password"
      autocomplete="new-password"
      required
    />
    <ErrorMessage :message="save.error" />
    <Button type="submit" variant="solid" label="Save password" :loading="save.loading" />
  </form>
</template>
