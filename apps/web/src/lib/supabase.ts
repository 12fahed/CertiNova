import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { env } from './env'

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)

export const BUCKETS = {
  templates: 'templates',
  certificates: 'certificates',
} as const

const SIGNED_URL_TTL_SECONDS = 600

export async function signedUrl(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
  if (error) throw error
  return data.signedUrl
}

/** Signed URLs for many objects in one request, keyed by path. Paths that fail are left out. */
export async function signedUrls(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS)
  if (error) throw error
  return new Map(
    data.flatMap((item) => (item.path && item.signedUrl ? [[item.path, item.signedUrl]] : [])),
  )
}
