# 0016. Expose verify through a Hasura native query

- Status: Accepted
- Date: 2026-11-21

## Context

The public verify page needs certificate details for one id. `public.verify_certificate(uuid)` returns a plain row set. Hasura tracks only functions that return a tracked table. Read access to a real table or view for `anonymous` would let anyone list every certificate.

## Decision

Expose the function through a Hasura native query `verify_certificate` that returns the logical model `certificate_verification`. Give `anonymous` and `user` select permission on the logical model. Do not track `certificates` for `anonymous`.

## Consequences

Anonymous callers can look up one certificate by id and nothing else. The SQL function keeps the privacy rules (no email, name only if the organisation allows it). A change to the function columns needs the same change in the logical model.
