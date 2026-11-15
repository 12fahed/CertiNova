# 0009. Support organisations with many members

- Status: Accepted
- Date: 2026-11-15

## Context

One user is one organisation in the old app. Teams cannot share events.

## Decision

Add `organizations` and `organization_members` with roles owner, admin and member. Migration makes each old user the owner of one organisation.

## Consequences

Every owned table has `org_id`. Permissions check membership on each row.
