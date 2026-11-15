# 0004. Use Vue 3 and Frappe UI for the frontend

- Status: Accepted
- Date: 2026-11-15

## Context

The old frontend is Next.js. The new frontend talks to Hasura and Supabase only, so it does not need server rendering.

## Decision

Use Vue 3, Vite and TypeScript (strict). Use Frappe UI for components. Do not use the Frappe UI data helpers, because they expect a Frappe backend. Use a GraphQL client (urql) for data.

## Consequences

The frontend is a static build. Each page is a full rewrite of the old Next.js page.
