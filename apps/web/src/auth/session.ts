import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { computed, readonly, shallowRef } from 'vue'
import { supabase } from '@/lib/supabase'

const session = shallowRef<Session | null>(null)
const listeners = new Set<(event: AuthChangeEvent) => void>()
let ready: Promise<void> | null = null

/** Loads the stored session once and keeps it in sync with Supabase Auth. */
export function initSession(): Promise<void> {
  ready ??= (async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    supabase.auth.onAuthStateChange((event, next) => {
      session.value = next
      listeners.forEach((listener) => listener(event))
    })
  })()
  return ready
}

export function onAuthEvent(listener: (event: AuthChangeEvent) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function accessToken(): string | undefined {
  return session.value?.access_token
}

export function useSession() {
  return {
    session: readonly(session),
    user: computed(() => session.value?.user ?? null),
    isSignedIn: computed(() => session.value !== null),
  }
}
