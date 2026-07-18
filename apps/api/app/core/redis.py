"""Redis connection pool and helpers."""

from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Annotated

import redis.asyncio as aioredis
from fastapi import Depends

from app.core.config import get_settings

settings = get_settings()

_pool: aioredis.ConnectionPool | None = None


def get_redis_pool() -> aioredis.ConnectionPool:
    """Return (or lazily create) the shared Redis connection pool."""
    global _pool
    if _pool is None:
        _pool = aioredis.ConnectionPool.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
            max_connections=50,
        )
    return _pool


async def get_redis() -> AsyncGenerator[aioredis.Redis, None]:  # type: ignore[type-arg]
    """Yield a Redis client from the shared pool."""
    client: aioredis.Redis = aioredis.Redis(connection_pool=get_redis_pool())  # type: ignore[type-arg]
    try:
        yield client
    finally:
        await client.aclose()


# Convenient FastAPI dependency annotation
RedisClient = Annotated[aioredis.Redis, Depends(get_redis)]  # type: ignore[type-arg]


async def close_redis_pool() -> None:
    """Disconnect all pool connections — call on app shutdown."""
    global _pool
    if _pool is not None:
        await _pool.aclose()
        _pool = None
