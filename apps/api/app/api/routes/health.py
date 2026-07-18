"""Health and readiness endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel

from app import __version__

router = APIRouter(tags=["health"])


class HealthStatus(BaseModel):
    """Health probe response."""

    status: str = "ok"
    service: str = "cognix-api"
    version: str = __version__


@router.get("/health", response_model=HealthStatus, summary="Liveness probe")
async def health() -> HealthStatus:
    """Return service liveness and version information."""
    return HealthStatus()
