import type { CodegenConfig } from '@graphql-codegen/cli'

// Introspect as role "user" so the schema matches what the frontend may call.
const url = process.env.HASURA_GRAPHQL_URL ?? 'http://localhost:8080/v1/graphql'
const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET ?? 'local-admin-secret'

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    { [url]: { headers: { 'x-hasura-admin-secret': adminSecret, 'x-hasura-role': 'user' } } },
  ],
  generates: {
    'src/graphql/schema.graphql': {
      plugins: ['schema-ast'],
      config: { sort: true, includeDirectives: false },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
