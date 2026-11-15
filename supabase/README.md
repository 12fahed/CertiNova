# supabase

SQL migrations, RLS policies, storage buckets and seed data for CertiNova. These migrations own the database schema.

## Setup

The CLI runs through npm, so you do not need a global install:

```bash
npm run supabase -- login
npm run supabase -- link --project-ref <dev-project-ref>
```

## Daily use

- Make a migration: `npm run supabase -- migration new <name>`
- Run Postgres locally (needs Docker): `npm run supabase -- start`
- Apply migrations to the linked project: `npm run supabase -- db push`

Do not change the dev schema in the dashboard. Write a migration.
