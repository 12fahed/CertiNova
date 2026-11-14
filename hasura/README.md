# hasura

Hasura metadata for CertiNova. Hasura Cloud runs the engine. This folder is the source of truth for its metadata.

## Setup

1. Install the Hasura CLI v2: https://hasura.io/docs/2.0/hasura-cli/install-hasura-cli/
2. Copy `.env.example` to `.env`. Set the endpoint and the admin secret of the **dev** project.
3. Export the current metadata from Hasura Cloud:

   ```bash
   cd hasura
   hasura metadata export
   ```

4. Commit the files in `metadata/`.

## Rules

- Change metadata in git, then apply it. Do not change dev metadata only in the console.
- Apply: `hasura metadata apply && hasura metadata ic list`. The inconsistency list must be empty.
- Database schema changes go in `supabase/migrations`, not in Hasura migrations.
