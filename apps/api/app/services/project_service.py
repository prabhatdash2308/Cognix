"""Project service."""

from __future__ import annotations

import logging
from collections.abc import Sequence
from datetime import UTC, datetime

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.models.project import Project, ProjectMember, ProjectRole, ProjectStatus, ProjectVisibility
from app.models.user import User
from app.services.audit_service import AuditService

logger = logging.getLogger(__name__)


class ProjectService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(
        self,
        workspace_id: str,
        name: str,
        description: str | None,
        emoji: str | None,
        color: str | None,
        visibility: ProjectVisibility,
        settings: dict | None,
        metadata: dict | None,
        creator: User,
    ) -> Project:
        slug = slugify(name, max_length=80)
        await self._assert_slug_free(workspace_id, slug)

        project = Project(
            workspace_id=workspace_id,
            name=name,
            slug=slug,
            description=description,
            emoji=emoji,
            color=color,
            visibility=visibility,
            owner_id=creator.id,
            settings=settings or {},
            metadata_=metadata or {},
        )
        self._db.add(project)
        await self._db.flush()

        # Creator is the owner of the project
        member = ProjectMember(project_id=project.id, user_id=creator.id, role=ProjectRole.OWNER)
        self._db.add(member)
        await self._db.flush()

        await AuditService(self._db).log(
            action="project.created",
            resource="project",
            resource_id=project.id,
            user_id=creator.id,
        )
        return project

    async def get(self, project_id: str) -> Project:
        result = await self._db.execute(
            select(Project).where(Project.id == project_id, Project.deleted_at.is_(None))
        )
        project = result.scalar_one_or_none()
        if project is None:
            raise NotFoundError("Project")
        return project

    async def list_for_workspace(self, workspace_id: str) -> Sequence[Project]:
        result = await self._db.execute(
            select(Project).where(
                Project.workspace_id == workspace_id,
                Project.deleted_at.is_(None),
            )
        )
        return result.scalars().all()

    async def update(
        self,
        project: Project,
        *,
        name: str | None = None,
        description: str | None = None,
        emoji: str | None = None,
        color: str | None = None,
        visibility: ProjectVisibility | None = None,
        status: ProjectStatus | None = None,
        settings: dict | None = None,
        metadata: dict | None = None,
        actor: User,
    ) -> Project:
        if name is not None:
            project.name = name
            project.slug = slugify(name, max_length=80)
            await self._assert_slug_free(project.workspace_id, project.slug, exclude_id=project.id)

        if description is not None:
            project.description = description
        if emoji is not None:
            project.emoji = emoji
        if color is not None:
            project.color = color
        if visibility is not None:
            project.visibility = visibility
        if status is not None:
            project.status = status
            if status == ProjectStatus.ARCHIVED and project.archived_at is None:
                project.archived_at = datetime.now(UTC)
            elif status != ProjectStatus.ARCHIVED:
                project.archived_at = None

        if settings is not None:
            project.settings = settings
        if metadata is not None:
            project.metadata_ = metadata

        await AuditService(self._db).log(
            action="project.updated",
            resource="project",
            resource_id=project.id,
            user_id=actor.id,
        )
        return project

    async def archive(self, project: Project, actor: User) -> Project:
        project.status = ProjectStatus.ARCHIVED
        project.archived_at = datetime.now(UTC)
        await AuditService(self._db).log(
            action="project.archived",
            resource="project",
            resource_id=project.id,
            user_id=actor.id,
        )
        return project

    async def restore(self, project: Project, actor: User) -> Project:
        project.status = ProjectStatus.ACTIVE
        project.archived_at = None
        await AuditService(self._db).log(
            action="project.restored",
            resource="project",
            resource_id=project.id,
            user_id=actor.id,
        )
        return project

    async def soft_delete(self, project: Project, actor: User) -> None:
        project.deleted_at = datetime.now(UTC)
        await AuditService(self._db).log(
            action="project.deleted",
            resource="project",
            resource_id=project.id,
            user_id=actor.id,
        )

    async def list_members(self, project_id: str) -> Sequence[ProjectMember]:
        result = await self._db.execute(
            select(ProjectMember).where(ProjectMember.project_id == project_id)
        )
        return result.scalars().all()

    async def add_member(
        self,
        project_id: str,
        user_id: str,
        role: ProjectRole,
        actor: User,
    ) -> ProjectMember:
        member = ProjectMember(project_id=project_id, user_id=user_id, role=role)
        self._db.add(member)
        await self._db.flush()

        await AuditService(self._db).log(
            action="project.member_added",
            resource="project_member",
            resource_id=member.id,
            user_id=actor.id,
        )
        return member

    async def remove_member(self, project_id: str, user_id: str, actor: User) -> None:
        result = await self._db.execute(
            select(ProjectMember).where(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id,
            )
        )
        member = result.scalar_one_or_none()
        if member is None:
            raise NotFoundError("Project member")

        await self._db.delete(member)
        await AuditService(self._db).log(
            action="project.member_removed",
            resource="project_member",
            resource_id=member.id,
            user_id=actor.id,
        )

    async def _assert_slug_free(
        self, workspace_id: str, slug: str, exclude_id: str | None = None
    ) -> None:
        stmt = select(Project).where(
            Project.workspace_id == workspace_id,
            Project.slug == slug,
            Project.deleted_at.is_(None),
        )
        if exclude_id:
            stmt = stmt.where(Project.id != exclude_id)

        result = await self._db.execute(stmt)
        if result.scalar_one_or_none() is not None:
            raise ConflictError("A project with this slug already exists.", "slug_taken")
