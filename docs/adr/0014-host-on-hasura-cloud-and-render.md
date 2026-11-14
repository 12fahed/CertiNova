# 0014. Host on Hasura Cloud, Render and a static host

- Status: Accepted
- Date: 2026-11-15

## Context

The team wants managed services and low operations work.

## Decision

Use Hasura Cloud for GraphQL. Run the Flask API, the worker and Redis on Render. Put the frontend on a static host (Vercel or Netlify). Use one project for each environment: dev, staging, prod.

## Consequences

Each environment has its own secrets (see `docs/revamp/secrets.md`).
