# syntax=docker/dockerfile:1

# ── Builder ──────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

# uv provides fast, reproducible dependency resolution.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0

WORKDIR /app

# Install dependencies first for better layer caching.
COPY apps/api/pyproject.toml ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-dev --no-install-project

COPY apps/api/ .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-dev

# ── Runner ───────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runner

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN groupadd --system --gid 1001 cognix \
  && useradd --system --uid 1001 --gid cognix cognix

WORKDIR /app
COPY --from=builder --chown=cognix:cognix /app /app
USER cognix

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
