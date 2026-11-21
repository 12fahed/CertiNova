# supabase

SQL migrations, RLS policies, storage buckets and seed data for CertiNova. These migrations own the database schema.

## Setup

The CLI runs through npm, so you do not need a global install:

```bash
npm run supabase -- login
npm run supabase -- link --project-ref <dev-project-ref>
```

## Daily use

1. Make a migration: `npm run supabase -- migration new <name>`
2. Apply all migrations and the seed locally: `npm run supabase -- db reset`
3. Run the database tests: `npm run db:test`
4. Regenerate the types: `npm run db:codegen`. Commit the generated files with the migration.
5. Apply migrations to the linked project: `npm run supabase -- db push`

Start the local stack (needs Docker) with only the services the schema needs:

```bash
npm run supabase -- start -x studio,imgproxy,mailpit,edge-runtime,logflare,vector,supavisor,realtime,postgres-meta
```

Do not change the dev schema in the dashboard. Write a migration.

## Layout

| Path | Contents |
|---|---|
| `migrations/` | Schema, RLS, storage buckets and policies, reference data (fonts) |
| `tests/database/` | pgTAP tests for constraints, RLS and the verify function |
| `seed.sql` | Local dev data only. Login: `owner@`, `admin@`, `member@certinova.local`, password `password123` |

Generated from the schema (do not edit by hand):

- `apps/web/src/types/database.ts`
- `apps/api/src/certinova_api/db/models.py`

## Schema rules

- Every org-owned table has `org_id`. Child tables use composite foreign keys (`(parent_id, org_id)`), so a row can never point to another organisation's data.
- Helper functions for RLS live in the `private` schema. The API roles cannot call anything else there.
- The `legacy` schema is for the MongoDB migration only. API roles have no access to it.
