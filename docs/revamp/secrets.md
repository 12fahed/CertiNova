# Secrets and environment variables

Each value has one home for each environment. Do not copy secrets into other places.

## Rules

1. Do not commit a real value. Git tracks only `*.env.example` files.
2. Put a new variable in the correct `.env.example` file before you use it in code.
3. Do not put a secret in a `VITE_*` variable. Vite adds all `VITE_*` values to the browser bundle.
4. Use the Supabase service role key only in `apps/api` and `tools/migrate`. Never use it in `apps/web`.
5. If a secret leaks, rotate it immediately. Then update each home in the table below.
6. The `secret-scan` workflow (gitleaks) scans each push and each pull request.

## Where each value lives (dev)

| Variable | Used by | Home | Secret |
|---|---|---|---|
| `DATABASE_URL` | apps/api, worker | Render env group `certinova-dev` | yes |
| `REDIS_URL` | apps/api, worker | Render env group `certinova-dev` (internal URL) | yes |
| `HASURA_ACTION_SECRET` | apps/api, Hasura | Render env group and Hasura Cloud env vars (same value) | yes |
| `SUPABASE_URL` | apps/api, tools/migrate | Render env group, local `.env` | no |
| `SUPABASE_SERVICE_ROLE_KEY` | apps/api, tools/migrate | Render env group, local `.env` | yes |
| `SMTP_*`, `EMAIL_FROM_ADDRESS` | worker | Render env group `certinova-dev` | yes |
| `VITE_SUPABASE_URL` | apps/web | Vercel project env, local `.env.local` | no |
| `VITE_SUPABASE_ANON_KEY` | apps/web | Vercel project env, local `.env.local` | no (public) |
| `VITE_HASURA_GRAPHQL_URL` | apps/web | Vercel project env, local `.env.local` | no |
| `PG_DATABASE_URL` | Hasura | Hasura Cloud env vars | yes |
| `HASURA_GRAPHQL_JWT_SECRET` | Hasura | Hasura Cloud env vars (P2) | no (JWKS URL) |
| `HASURA_GRAPHQL_UNAUTHORIZED_ROLE` | Hasura | Hasura Cloud env vars (P2) | no |
| `ACTION_BASE_URL` | Hasura | Hasura Cloud env vars (P2) | no |
| `HASURA_GRAPHQL_ENDPOINT` | Hasura CLI | local `hasura/.env`, GitHub Actions variable (P2) | no |
| `HASURA_GRAPHQL_ADMIN_SECRET` | Hasura CLI | local `hasura/.env`, GitHub Actions secret (P2) | yes |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI in CI | GitHub Actions secret (P1) | yes |
| `SUPABASE_DB_PASSWORD` | Supabase CLI in CI | GitHub Actions secret (P1) | yes |
| `MONGODB_URI` | tools/migrate | local `tools/migrate/.env` only (read-only user) | yes |
| `CLOUDINARY_*` | tools/migrate | local `tools/migrate/.env` only | yes |

Staging and prod use the same names. Each one gets its own Render env group, Hasura Cloud project and Vercel environment.

## Local files

| File | Copy from |
|---|---|
| `apps/api/.env` | `apps/api/.env.example` |
| `apps/web/.env.local` | `apps/web/.env.example` |
| `hasura/.env` | `hasura/.env.example` |
| `tools/migrate/.env` | `tools/migrate/.env.example` |
