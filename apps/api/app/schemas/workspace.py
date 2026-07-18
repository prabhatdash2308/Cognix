"""Workspace schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.schemas.common import CognixModel
from app.schemas.organization import RoleResponse
from app.schemas.user import UserResponse


class WorkspaceCreate(CognixModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None


class WorkspaceUpdate(CognixModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None


class WorkspaceResponse(CognixModel):
    id: str
    organization_id: str
    name: str
    slug: str
    description: str | None
    created_at: datetime
    updated_at: datetime


class WorkspaceMemberResponse(CognixModel):
    id: str
    user: UserResponse
    role: RoleResponse
    created_at: datetime


class AddMemberRequest(CognixModel):
    user_id: str
    role_name: str = "member"
