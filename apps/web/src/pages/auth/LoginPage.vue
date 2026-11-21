<script setup lang="ts">
import { Button, ErrorMessage, FormControl } from 'frappe-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { redirectTarget } from '@/auth/redirect'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')

const login = useTask(async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value,
  })
  if (error) throw error
  await router.replace(redirectTarget(route.query) ?? { name: 'dashboard' })
})
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="login.run()">
    <h1 class="text-xl font-semibold text-ink-gray-9">Log in</h1>
    <FormControl v-model="email" label="Email" type="email" autocomplete="email" required />
    <FormControl
      v-model="password"
      label="Password"
      type="password"
      autocomplete="current-password"
      required
    />
    <ErrorMessage :message="login.error" />
    <Button type="submit" variant="solid" label="Log in" :loading="login.loading" />
    <div class="flex justify-between text-sm">
      <RouterLink class="text-ink-gray-6 hover:text-ink-gray-9" :to="{ name: 'forgot-password' }">
        Forgot password?
      </RouterLink>
      <RouterLink
        class="text-ink-gray-6 hover:text-ink-gray-9"
        :to="{ name: 'signup', query: route.query }"
      >
        Make an account
      </RouterLink>
    </div>
  </form>
</template>
