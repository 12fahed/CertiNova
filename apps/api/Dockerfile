# One image for the API and the worker. Build from the repo root:
#   docker build -f apps/api/Dockerfile -t certinova-api .
# API:    default command (gunicorn)
# Worker: python -m certinova_api.worker
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/app/.venv

# Open, metric-compatible fonts for the system fonts the editor offers (Arial, Times New Roman, ...).
RUN apt-get update \
    && apt-get install -y --no-install-recommends fonts-liberation2 fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv==0.11.18

WORKDIR /app
COPY pyproject.toml uv.lock ./
COPY apps/api/pyproject.toml apps/api/
COPY tools/migrate/pyproject.toml tools/migrate/
COPY hasura/tests/pyproject.toml hasura/tests/
RUN uv sync --frozen --no-dev --package certinova-api --no-install-workspace

COPY apps/api/src apps/api/src
RUN uv sync --frozen --no-dev --package certinova-api

RUN useradd --create-home --uid 10001 app && mkdir -p /app/fonts && chown app /app/fonts
USER app

ENV PATH="/app/.venv/bin:$PATH" \
    FONTS_DIR=/app/fonts \
    PORT=5000
EXPOSE 5000

CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY:-2} --timeout 60 --access-logfile - 'certinova_api:create_app()'"]
