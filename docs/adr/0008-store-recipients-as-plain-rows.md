# 0008. Store recipient data as plain rows

- Status: Accepted
- Date: 2026-11-15

## Context

The old app encrypts recipients with the login password. The server cannot read names, so verify shows a sample name and search decrypts all data in memory.

## Decision

Store recipients as rows in `certificates`. Protect them with Hasura permissions and Supabase RLS. Do not encrypt with user passwords.

## Consequences

Search, email and verify use plain SQL. Old encrypted data needs a one-time unlock (see ADR 0011).
