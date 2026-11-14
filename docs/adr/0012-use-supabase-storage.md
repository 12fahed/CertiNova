# 0012. Use Supabase Storage for all files

- Status: Accepted
- Date: 2026-11-15

## Context

The old app keeps templates in Cloudinary. The new app also stores rendered certificates and exports.

## Decision

Use private Supabase Storage buckets: `templates`, `certificates`, `exports`. Copy the Cloudinary templates during migration.

## Consequences

Files use the same auth and policies as the database. One vendor less to manage.
