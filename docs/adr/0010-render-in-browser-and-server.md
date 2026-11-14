# 0010. Render in the browser and on the server

- Status: Accepted
- Date: 2026-11-15

## Context

The old app draws certificates only in the browser. Email, re-download and verify need a server copy.

## Decision

The browser draws a live preview. Flask draws the final PNG with Pillow and puts it in Supabase Storage. Both use the same field data and one text-fit spec.

## Consequences

Two renderers must give the same result. Golden image tests compare them. The server needs all font files.
