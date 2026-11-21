<script setup lang="ts">
import { Alert, Button, ErrorMessage, FormControl } from 'frappe-ui'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { passwordProblem } from '@/auth/password'
import { redirectTarget } from '@/auth/redirect'
import { supabase } from '@/lib/supabase'
import { useTask } from '@/lib/useTask'

const route = useRoute()
const router = useRouter()
const next = redirectTarget(route.query) ?? '/onboarding'
const fullName = ref('')
const email = ref('')
const password = ref('')
const checkEmail = ref(false)

const signup = useTask(async () => {
  const problem = passwordProblem(password.value)
  if (problem) throw new Error(problem)
  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value,
    options: {
      data: { full_name: fullName.value.trim() },
      emailRedirectTo: `${window.location.origin}${next}`,
    },
  })
  if (error) throw error
  // No session means the project asks for email confirmation first.
  if (data.session) await router.replace(next)
  else checkEmail.value = true
})
</script>

<template>
  <div v-if="checkEmail" class="flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-ink-gray-9">Check your email</h1>
    <p class="text-p-sm text-ink-gray-7">
      We sent a link to <b>{{ email }}</b>. Open it to confirm your account.
    </p>
  </div>
  <form v-else class="flex flex-col gap-4" @submit.prevent="signup.run()">
    <h1 class="text-xl font-semibold text-ink-gray-9">Make an account</h1>
    <FormControl
      v-model="fullName"
      label="Full name"
      autocomplete="name"
      required
      maxlength="200"
    />
    <FormControl v-model="email" label="Email" type="email" autocomplete="email" required />
    <FormControl
      v-model="password"
      label="Password"
      type="password"
      autocomplete="new-password"
      description="8 or more characters, with letters and digits."
      required
    />
    <Alert
      theme="blue"
      title="Used CertiNova before?"
      description="Log in with your old email and password. Your account was moved."
    />
    <ErrorMessage :message="signup.error" />
    <Button type="submit" variant="solid" label="Sign up" :loading="signup.loading" />
    <p class="text-sm text-ink-gray-6">
      Have an account?
      <RouterLink class="text-ink-gray-9 underline" :to="{ name: 'login', query: route.query }"
        >Log in</RouterLink
      >
    </p>
  </form>
</template>
