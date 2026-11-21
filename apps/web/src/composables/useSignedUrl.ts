import { ref, watchEffect, type Ref } from 'vue'
import { BUCKETS, signedUrl, signedUrls } from '@/lib/supabase'

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

/** Signed URLs for a list of private objects, keyed by path. Empty until they load. */
export function useSignedUrls(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  paths: Ref<string[]>,
): Ref<Map<string, string>> {
  const urls = ref(new Map<string, string>())
  watchEffect(async (onCleanup) => {
    let cancelled = false
    onCleanup(() => (cancelled = true))
    const wanted = [...paths.value]
    try {
      const next = await signedUrls(bucket, wanted)
      if (!cancelled) urls.value = next
    } catch {
      // Thumbnails are optional.
    }
  })
  return urls
}
