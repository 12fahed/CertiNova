# CertiNova revamp

The revamp moves CertiNova to Flask, Vue 3 with Frappe UI, Supabase Postgres, Supabase Auth and Hasura GraphQL. The old apps (`certinova-backend`, `certinova-frontend`) stay live until cutover.

- Plan and tracker: https://claude.ai/artifact/1JfWWw1xTBtkZn2GnyvXk1
- Decisions: [docs/adr](../adr/README.md)
- Secrets: [secrets.md](secrets.md)

## Layout

| Folder | Contents |
|---|---|
| `apps/api` | Flask API for Hasura Actions and Event Triggers, and the worker |
| `apps/web` | Vue 3 frontend |
| `hasura` | Hasura metadata |
| `supabase` | SQL migrations, RLS, storage, seed |
| `tools/migrate` | One-time MongoDB to Postgres migration |

## Requirements

- Python 3.12 and [uv](https://docs.astral.sh/uv/)
- Node.js 22 or later
- Docker (only to run Supabase locally)
- Hasura CLI v2

## Setup

1. Install the Python packages from the repo root:

   ```bash
   uv sync --all-packages
   ```

2. Install the web packages:

   ```bash
   cd apps/web && npm ci
   ```

3. Make the local env files. See [secrets.md](secrets.md).

## Commands

| Task | Command |
|---|---|
| Run the API | `cd apps/api && uv run flask --app certinova_api:create_app run --debug` |
| Test the API | `cd apps/api && uv run pytest` |
| Lint and type-check Python | `uv run ruff check . && uv run mypy src tests` (in the package folder) |
| Run the web app | `cd apps/web && npm run dev` |
| Check the web app | `cd apps/web && npm run lint && npm run type-check` |
| Run the Supabase CLI | `npm run supabase -- <command>` |
