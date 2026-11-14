# 0015. Generate types from the schema

- Status: Accepted
- Date: 2026-11-15

## Context

Types written by hand drift from the database and the GraphQL schema.

## Decision

Generate types: `supabase gen types` for Supabase helpers, `graphql-codegen` for the Vue queries, `sqlacodegen` for SQLAlchemy models, `datamodel-code-generator` for Action payloads. CI fails if generated files differ from the committed files.

## Consequences

A schema change and its generated types go in the same pull request.
