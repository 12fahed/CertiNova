# 0013. Show the recipient name on verify by default

- Status: Accepted
- Date: 2026-11-15

## Context

With plain rows, the verify page can show the real name. Some organisations may not want this.

## Decision

Show the name, event, issuer and date by default. Each organisation can hide the name. Never show the email.

## Consequences

The verify function reads `organizations.show_name_on_verify`.
