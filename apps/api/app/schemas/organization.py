"""Organization schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.schemas.common import CognixModel
from app.schemas.user import UserResponse


class OrgCreate(CognixModel):
    name: str = Field(min_length=1, max_length=200)


class OrgUpdate(CognixModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    slug: str | None = Field(default=None, min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    logo_url: str | None = None


class OrgResponse(CognixModel):
    id: str
    name: str
    slug: str
    logo_url: str | None
    plan: str
    created_at: datetime
    updated_at: datetime


class RoleResponse(CognixModel):
    id: str
    name: str
    description: str | None
    is_system: bool
    precedence: int


class MemberResponse(CognixModel):
    id: str
    user: UserResponse
    role: RoleResponse
    created_at: datetime
