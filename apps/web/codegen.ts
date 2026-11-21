import type { CodegenConfig } from '@graphql-codegen/cli'

const dbEnum = (name: string) =>
  `import('../../types/database').Database['public']['Enums']['${name}']`

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema.graphql',
  documents: ['src/**/*.{ts,vue}', '!src/graphql/generated/**'],
  ignoreNoDocuments: true,
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        skipTypename: true,
        defaultScalarType: 'unknown',
        scalars: {
          uuid: 'string',
          date: 'string',
          timestamptz: 'string',
          citext: 'string',
          bigint: 'number',
          numeric: 'number',
          jsonb: 'Record<string, unknown>',
          org_role: dbEnum('org_role'),
          field_key: dbEnum('field_key'),
          font_weight: dbEnum('font_weight'),
          font_style: dbEnum('font_style'),
          text_decoration: dbEnum('text_decoration'),
          batch_status: dbEnum('batch_status'),
          render_status: dbEnum('render_status'),
          delivery_status: dbEnum('delivery_status'),
          job_kind: dbEnum('job_kind'),
          job_status: dbEnum('job_status'),
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
