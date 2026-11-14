# 0005. Use Supabase Postgres with SQL migrations

- Status: Accepted
- Date: 2026-11-15

## Context

MongoDB has no schema, no foreign keys and no row-level security. The data is relational: organisations, events, templates, batches, certificates.

## Decision

Use Supabase Postgres. SQL migrations in `supabase/migrations` own the schema. Do not use Hasura migrations. Do not change the schema in a dashboard.

## Consequences

Every schema change has a migration file and a review. Codegen reads the schema after each migration.
