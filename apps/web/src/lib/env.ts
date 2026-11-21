function required(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`${name} is not set. Copy apps/web/.env.example to apps/web/.env.local.`)
  }
  return value
}

const hasuraHttpUrl = required('VITE_HASURA_GRAPHQL_URL')

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL'),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY'),
  hasuraHttpUrl,
  hasuraWsUrl: hasuraHttpUrl.replace(/^http/, 'ws'),
} as const
