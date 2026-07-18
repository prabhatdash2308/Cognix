"""SlowAPI rate limiter configuration."""

from __future__ import annotations

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import get_settings

settings = get_settings()

# Use the real IP address from X-Forwarded-For behind proxies
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.rate_limit_default])


def configure_rate_limiting(app: object) -> None:  # type: ignore[type-arg]
    """Attach SlowAPI middleware and exception handler to the FastAPI *app*."""
    from fastapi import FastAPI

    assert isinstance(app, FastAPI)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
