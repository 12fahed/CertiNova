# hasura

Hasura metadata for CertiNova. Hasura Cloud runs the engine. This folder is the source of truth for its metadata.

## Contents

| Path | Contents |
|---|---|
| `metadata/databases/` | Source `certinova`, tracked tables, relationships, permissions, the `verify_certificate` native query |
| `metadata/actions.*` | Actions. Hasura calls `{{ACTION_BASE_URL}}/actions/<name>` on the Flask API |
| `docker-compose.yml` | Local Hasura on the local Supabase network. It applies `metadata/` on start |
| `tests/` | Permission tests (pytest) against the local stack |

## Roles

| Role | Who | Gets it from |
|---|---|---|
| `anonymous` | No token | `HASURA_GRAPHQL_UNAUTHORIZED_ROLE`. Only `verify_certificate` and `get_verify_preview_url` |
| `user` | Signed-in person | Supabase JWT. The access token hook adds the Hasura claims |
| `admin` | Ops and CI only | Admin secret. Never send it from the frontend |

Organisation roles (owner, admin, member) are not Hasura roles. Each permission checks them on `organization.members`:

- member: `organization.members.user_id = X-Hasura-User-Id`
- admin: the same row, with `role` in `[owner, admin]`

Other rules:

- `created_by` comes from the session. Clients cannot set it.
- Clients send `org_id`. Every insert check confirms the caller belongs to that organisation.
- Only owners grant, change or remove the owner role.
- `organization_invites.token_hash` is never selectable.
- Certificates can be added only to a batch in `draft` status.
- The Supabase RLS policies mirror these rules. Change both together.

## Local run

Needs the local Supabase stack (see `supabase/README.md`).

```bash
npm run supabase -- start -x studio,imgproxy,mailpit,edge-runtime,logflare,vector,supavisor,realtime,postgres-meta
docker compose -f hasura/docker-compose.yml up -d --wait
```

GraphQL: `http://localhost:8080/v1/graphql`. Admin secret: `local-admin-secret`. Restart the container to apply metadata changes:

```bash
docker compose -f hasura/docker-compose.yml restart hasura
```

## Tests

```bash
export SUPABASE_ANON_KEY=$(npm run --silent supabase -- status -o env | grep '^ANON_KEY=' | cut -d= -f2- | tr -d '"')
cd hasura/tests && uv run pytest
```

The tests sign in the seed users and call Hasura with real tokens.

## GraphQL types for the web app

After a metadata or schema change:

```bash
cd apps/web
npm run codegen:schema   # introspects the local Hasura as role "user"
npm run codegen          # builds typed documents from src/graphql/schema.graphql
```

Commit `apps/web/src/graphql/`. CI fails if it is stale.

## Apply to Hasura Cloud

1. Install the Hasura CLI v2: https://hasura.io/docs/2.0/hasura-cli/install-hasura-cli/
2. Copy `.env.example` to `.env`. Set the endpoint and the admin secret of the target project.
3. Make sure the project has every env var in `docs/revamp/secrets.md`.
4. Apply and check:

   ```bash
   cd hasura
   hasura metadata apply
   hasura metadata ic list
   ```

   The inconsistency list must be empty.

## Rules

- Change metadata in git, then apply it. Do not change metadata only in the console.
- Do not put comments in metadata YAML. `hasura metadata export` removes them. Write notes here.
- Before you commit an export, check the diff for a database URL. Use `from_env` only.
- Database schema changes go in `supabase/migrations`, not in Hasura migrations.
