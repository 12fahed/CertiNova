<script setup lang="ts">
import { Button, ErrorMessage, FormControl } from 'frappe-ui'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'

const email = ref('')
const sent = ref(false)

const send = useTask(async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
  sent.value = true
})
</script>

<template>
  <div v-if="sent" class="flex flex-col gap-4">
    <h1 class="text-h1 font-bold text-ink-gray-9">Check your email</h1>
    <p class="text-p-sm text-ink-gray-7">
      If an account uses <b>{{ email }}</b>, we sent it a link to set a new password.
    </p>
    <RouterLink class="link text-sm" :to="{ name: 'login' }"> Back to log in </RouterLink>
  </div>
  <form v-else class="flex flex-col gap-4" @submit.prevent="send.run()">
    <h1 class="text-h1 font-bold text-ink-gray-9">Forgot password</h1>
    <p class="text-p-sm text-ink-gray-7">
      Type your email. We will send you a link to set a new password.
    </p>
    <FormControl
      v-model="email"
      variant="outline"
      label="Email"
      type="email"
      autocomplete="email"
      required
    />
    <ErrorMessage :message="send.error" />
    <Button type="submit" variant="solid" theme="blue" label="Send link" :loading="send.loading" />
    <RouterLink class="link text-sm" :to="{ name: 'login' }"> Back to log in </RouterLink>
  </form>
</template>
