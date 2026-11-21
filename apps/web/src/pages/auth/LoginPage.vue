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
    <div>
      <h1 class="text-h1 font-bold text-ink-gray-9">Welcome back</h1>
      <p class="mt-1 text-p-sm text-ink-gray-6">Log in to your organisation.</p>
    </div>
    <FormControl
      v-model="email"
      variant="outline"
      label="Email"
      type="email"
      autocomplete="email"
      required
    />
    <FormControl
      v-model="password"
      variant="outline"
      label="Password"
      type="password"
      autocomplete="current-password"
      required
    />
    <ErrorMessage :message="login.error" />
    <Button type="submit" variant="solid" theme="blue" label="Log in" :loading="login.loading" />
    <div class="flex flex-col items-center gap-2 text-sm text-ink-gray-6">
      <RouterLink class="link" :to="{ name: 'forgot-password' }">Forgot password?</RouterLink>
      <span>
        New here?
        <RouterLink class="link" :to="{ name: 'signup', query: route.query }"
          >Make an account</RouterLink
        >
      </span>
    </div>
  </form>
</template>
