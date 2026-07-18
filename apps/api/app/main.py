"""Application entry point and factory."""

from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.api.router import api_router
from app.core.config import get_settings
from app.core.rate_limit import configure_rate_limiting

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Handle application startup and shutdown."""
    settings = get_settings()
    logger.info("Starting Cognix API v%s (%s)", __version__, settings.environment)

    # Seed system RBAC roles on startup (idempotent)
    try:
        from app.core.database import AsyncSessionLocal
        from app.services.rbac_service import RBACService

        async with AsyncSessionLocal() as db:
            await RBACService(db).seed_system_roles()
            await db.commit()
        logger.info("RBAC roles seeded successfully.")
    except Exception as exc:
        logger.warning("RBAC seed failed (DB may not be ready): %s", exc)

    yield

    # Shutdown
    from app.core.redis import close_redis_pool

    await close_redis_pool()
    logger.info("Cognix API shutdown complete.")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Cognix API",
        version=__version__,
        description="Backend service for the Cognix AI Organization Operating System.",
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    configure_rate_limiting(app)
    app.include_router(api_router)

    return app


app = create_app()
