# 0003. Use Python and Flask for the backend

- Status: Accepted
- Date: 2026-11-15

## Context

The backend must render images, make PDFs, send email and decrypt old data. Python has strong libraries for this work (Pillow, qrcode, cryptography).

## Decision

Use Flask for webhook endpoints. Use an RQ worker on Redis for long work. Use uv for packages, ruff for lint and format, mypy (strict) for types and pytest for tests.

## Consequences

Hasura calls Flask. The browser never calls Flask directly. The team must keep two languages (Python and TypeScript).
