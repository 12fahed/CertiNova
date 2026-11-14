# 0002. Use one monorepo with app folders

- Status: Accepted
- Date: 2026-11-15

## Context

The old repo has `certinova-backend` and `certinova-frontend`. The new stack adds Hasura metadata, SQL migrations and a migration tool.

## Decision

Keep all code in this repo. Use `apps/api`, `apps/web`, `hasura/`, `supabase/` and `tools/migrate/`. Delete the old folders after cutover.

## Consequences

One pull request can change schema, metadata and code together. CI runs only the workflows for the folders that change.
