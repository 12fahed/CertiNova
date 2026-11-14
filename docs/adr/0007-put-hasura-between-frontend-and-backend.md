# 0007. Put Hasura between the frontend and the backend

- Status: Accepted
- Date: 2026-11-15

## Context

The frontend needs typed data access with permissions for each role. Custom logic (render, email, unlock) needs a server.

## Decision

Hasura is the only API for the frontend. Hasura permissions control data access. Flask gets work only through Hasura Actions (sync) and Event Triggers (async). Flask checks a shared secret on each call.

## Consequences

Permissions live in Hasura metadata in git. Hasura uses one role for each request, so organisation roles are checked in row filters.
