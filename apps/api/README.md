# Cognix API

FastAPI backend for Cognix.

## Development

Requires [uv](https://docs.astral.sh/uv/).

```bash
uv sync --all-extras --dev        # install dependencies
uv run uvicorn app.main:app --reload --port 8000
```

The API is then available at http://localhost:8000 with interactive docs at
http://localhost:8000/docs.

## Quality

```bash
uv run ruff check .        # lint
uv run ruff format .       # format
uv run mypy .              # strict type checking
uv run pytest              # tests
```

## Structure

```
app/
  main.py          # application factory + entry point
  core/
    config.py      # environment-driven settings
  api/
    router.py      # aggregates route modules
    routes/
      health.py    # health / readiness endpoints
tests/             # pytest suite
```
