# 0011. Do a one-time cutover and unlock old data later

- Status: Accepted
- Date: 2026-11-15

## Context

Production MongoDB has live users. Printed QR codes point to `/verify/<uuid>`. The migration cannot decrypt old recipient data.

## Decision

Freeze writes, migrate, check, then switch DNS in one window. Copy each verify UUID with no change. Copy the encrypted data with no change. After the first login, the owner unlocks it one time with the old password.

## Consequences

Old QR codes continue to work. Old names stay hidden until unlock. Rollback is safe only before users write new data.
