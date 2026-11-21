#!/usr/bin/env sh
# Regenerate database types from the local Supabase database.
# Run after every migration change: npm run db:codegen
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
DB_URL=${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}
SUPABASE="npx --yes supabase@2.122.1"

WEB_TYPES=apps/web/src/types/database.ts
API_MODELS=src/certinova_api/db/models.py

cd "$ROOT"

echo "Generating $WEB_TYPES"
$SUPABASE gen types typescript --db-url "$DB_URL" --schema public > "$WEB_TYPES"
(cd apps/web && npx prettier --write "src/types/database.ts" >/dev/null)

echo "Generating apps/api/$API_MODELS"
# public is kept off the search path so every foreign key is reflected with an explicit schema.
uv run --directory apps/api sqlacodegen \
  --generator declarative \
  --options nojoined \
  --schemas public,legacy \
  --outfile "$API_MODELS" \
  "postgresql+psycopg://${DB_URL#postgresql://}?options=-csearch_path%3Dextensions"
# Composite foreign keys share columns, so relationships would fight over writes.
# The API sets foreign key columns directly; relationships are for reads only.
sed -i 's/back_populates=/viewonly=True, back_populates=/' "apps/api/$API_MODELS"
uv run --directory apps/api ruff format "$API_MODELS" >/dev/null
