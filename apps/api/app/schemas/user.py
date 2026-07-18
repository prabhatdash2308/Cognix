"""User schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.schemas.common import CognixModel


class UserResponse(CognixModel):
    id: str
    email: str
    name: str
    avatar_url: str | None
    status: str
    email_verified_at: datetime | None
    created_at: datetime
    updated_at: datetime


class UserUpdate(CognixModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    avatar_url: str | None = None
