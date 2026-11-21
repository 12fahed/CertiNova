# apps/web

Vue 3 app for CertiNova. Frappe UI gives the components. All data goes through Hasura (GraphQL). Supabase is used only for auth and file uploads.

## Layout

| Path                      | Contents                                                                         |
| ------------------------- | -------------------------------------------------------------------------------- |
| `src/router.ts`           | Routes and guards: `guestOnly`, `requiresAuth`, `requiresOrg`                    |
| `src/layouts/`            | `AppLayout` (sidebar, org switcher, unlock banner), `AuthLayout`, `PublicLayout` |
| `src/pages/`              | One file per route. `public/` has the landing, verify and legal pages            |
| `src/components/`         | Shared parts: dialogs, batch panels, preview, status badges                      |
| `src/auth/`, `src/org/`   | Session state, current organisation and role, slug and password rules            |
| `src/editor/`             | Template editor: canvas, style panel, geometry (natural image pixels)            |
| `src/rendering/`          | Browser preview. Follows `docs/revamp/rendering.md`, like the server renderer    |
| `src/recipients/`         | CSV and XLSX import and row checks                                               |
| `src/graphql/operations/` | GraphQL documents. `src/graphql/generated/` is made by codegen. Do not edit it   |
| `src/lib/`                | Supabase and urql clients, env, errors, formats, `useTask`                       |

Rules:

- Use Frappe UI for components only. Its data helpers expect a Frappe backend.
- Write each query in `src/graphql/operations/`, then run `npm run codegen`. Use the typed document with urql.
- Do not put a secret in a `VITE_*` variable.
- The organisation role (owner, admin, member) only hides buttons. Hasura and RLS do the real checks.

## Run locally

Start the local stack first (`supabase/README.md`, `hasura/README.md`, `apps/api/README.md`), then:

```bash
cd apps/web
cp .env.example .env.local   # local values are in the file comments
npm ci
npm run dev                  # http://localhost:5173
```

Seed users (local only): `owner@certinova.local`, `admin@certinova.local`, `member@certinova.local`, `outsider@certinova.local`. Password: `password123`.

For local `.env.local`, use `VITE_SUPABASE_URL=http://127.0.0.1:54321`, the anon or publishable key from `npm run supabase -- status`, and `VITE_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql`.

## Checks

```bash
npm run lint
npm run type-check
npm test             # Vitest: text fit, editor geometry, recipient import, filters, slugs
npm run build
npm run codegen      # after a change to a query or to the Hasura schema
```

## Deploy on Vercel

1. Make a Vercel project with root directory `apps/web`. Framework preset: Vite.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_HASURA_GRAPHQL_URL` (see `docs/revamp/secrets.md`).
3. `vercel.json` sends every path to `index.html`, so links such as `/verify/<id>` open the app.
4. In Supabase, go to Authentication > URL Configuration. Set the Site URL to the app URL. Add `<app URL>/**` to the redirect URLs, else email links do not open the app.
