"""Project model — first-class workspace entities."""

from __future__ import annotations

import enum
from datetime import UTC, datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.label import Label
    from app.models.task import Task
    from app.models.user import User
    from app.models.workspace import Workspace

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class ProjectStatus(enum.StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"


class ProjectVisibility(enum.StrEnum):
    PRIVATE = "private"
    TEAM = "team"
    PUBLIC = "public"


class ProjectRole(enum.StrEnum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class Project(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    """A project belongs to a workspace and contains tasks, documents, agents, etc."""

    __tablename__ = "projects"

    workspace_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    emoji: Mapped[str | None] = mapped_column(String(10), nullable=True)
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)

    visibility: Mapped[ProjectVisibility] = mapped_column(
        Enum(ProjectVisibility, name="project_visibility", native_enum=False),
        nullable=False,
        default=ProjectVisibility.TEAM,
    )
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, name="project_status", native_enum=False),
        nullable=False,
        default=ProjectStatus.ACTIVE,
    )

    owner_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )

    settings: Mapped[dict | None] = mapped_column(JSONB, nullable=True, default=dict)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True, default=dict)

    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    workspace: Mapped[Workspace] = relationship(back_populates="projects")
    owner: Mapped[User] = relationship()
    members: Mapped[list[ProjectMember]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    tasks: Mapped[list[Task]] = relationship(back_populates="project", cascade="all, delete-orphan")
    labels: Mapped[list[Label]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id!r} slug={self.slug!r} status={self.status.value!r}>"


class ProjectMember(UUIDPrimaryKeyMixin, Base):
    """A member of a project, defining their role and access level."""

    __tablename__ = "project_members"

    project_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role: Mapped[ProjectRole] = mapped_column(
        Enum(ProjectRole, name="project_role", native_enum=False),
        nullable=False,
        default=ProjectRole.VIEWER,
    )
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC)
    )

    project: Mapped[Project] = relationship(back_populates="members")
    user: Mapped[User] = relationship()

    def __repr__(self) -> str:
        return (
            f"<ProjectMember project_id={self.project_id!r} "
            f"user_id={self.user_id!r} role={self.role.value!r}>"
        )
