# 0006. Use Supabase Auth with Hasura JWT claims

- Status: Accepted
- Date: 2026-11-15

## Context

The old app has no real auth. The browser keeps the user in localStorage and the API trusts any user ID.

## Decision

Use Supabase Auth for signup, login and password reset. A Custom Access Token Hook adds the Hasura claims to the JWT. Hasura checks the JWT with the Supabase JWKS. A request without a JWT gets the `anonymous` role.

## Consequences

The user ID in each request comes from a signed token. Old users keep their passwords, because Supabase accepts the old bcrypt hashes.
