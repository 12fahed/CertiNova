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
