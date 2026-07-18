"""Project schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import Field

from app.models.project import ProjectRole, ProjectStatus, ProjectVisibility
from app.schemas.common import CognixModel
from app.schemas.user import UserResponse


class ProjectCreate(CognixModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    emoji: str | None = Field(default=None, max_length=10)
    color: str | None = Field(default=None, max_length=20)
    visibility: ProjectVisibility = ProjectVisibility.TEAM
    settings: dict[str, Any] | None = None
    metadata: dict[str, Any] | None = None


class ProjectUpdate(CognixModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    emoji: str | None = Field(default=None, max_length=10)
    color: str | None = Field(default=None, max_length=20)
    visibility: ProjectVisibility | None = None
    status: ProjectStatus | None = None
    settings: dict[str, Any] | None = None
    metadata: dict[str, Any] | None = None


class ProjectResponse(CognixModel):
    id: str
    workspace_id: str
    name: str
    slug: str
    description: str | None
    emoji: str | None
    color: str | None
    visibility: ProjectVisibility
    status: ProjectStatus
    owner_id: str
    settings: dict[str, Any] | None
    metadata: dict[str, Any] | None = Field(validation_alias="metadata_")
    archived_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ProjectMemberResponse(CognixModel):
    id: str
    project_id: str
    user: UserResponse
    role: ProjectRole
    joined_at: datetime


class AddProjectMemberRequest(CognixModel):
    user_id: str
    role: ProjectRole = ProjectRole.VIEWER
