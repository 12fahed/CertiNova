import { ref, watchEffect, type Ref } from 'vue'
import { BUCKETS, signedUrl } from '@/lib/supabase'

/** A short-lived URL for a private Storage object. Null while loading or when there is no path. */
export function useSignedUrl(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: Ref<string | null | undefined>,
): Ref<string | null> {
  const url = ref<string | null>(null)
  watchEffect(async (onCleanup) => {
    let cancelled = false
    onCleanup(() => (cancelled = true))
    url.value = null
    const key = path.value
    if (!key) return
    try {
      const next = await signedUrl(bucket, key)
      if (!cancelled) url.value = next
    } catch {
      // The image is optional on every page that uses this.
    }
  })
  return url
}
