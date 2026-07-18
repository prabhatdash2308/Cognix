"""Top-level API router aggregating all route modules."""

from fastapi import APIRouter

from app.api.routes import health
from app.api.routes.v1 import (
    auth,
    invitations,
    organizations,
    preferences,
    projects,
    users,
    workspaces,
)

api_router = APIRouter()

# Health check (unversioned, for infra probes)
api_router.include_router(health.router)

# V1 platform routes
v1_prefix = "/api/v1"
api_router.include_router(auth.router, prefix=v1_prefix)
api_router.include_router(users.router, prefix=v1_prefix)
api_router.include_router(organizations.router, prefix=v1_prefix)
api_router.include_router(workspaces.router, prefix=v1_prefix)
api_router.include_router(projects.router, prefix=v1_prefix)
api_router.include_router(invitations.router, prefix=v1_prefix)
api_router.include_router(preferences.router, prefix=v1_prefix)
