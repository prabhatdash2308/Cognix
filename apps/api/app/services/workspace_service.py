"""Workspace service."""

from __future__ import annotations

import logging
from datetime import UTC

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.models.membership import WorkspaceMember
from app.models.user import User
from app.models.workspace import Workspace
from app.services.audit_service import AuditService
from app.services.rbac_service import RBACService

logger = logging.getLogger(__name__)


class WorkspaceService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(
        self,
        org_id: str,
        name: str,
        description: str | None,
        creator: User,
    ) -> Workspace:
        slug = slugify(name, max_length=80)
        await self._assert_slug_free(org_id, slug)

        ws = Workspace(organization_id=org_id, name=name, slug=slug, description=description)
        self._db.add(ws)
        await self._db.flush()

        # Creator gets Admin role in the workspace
        rbac = RBACService(self._db)
        await rbac.assign_workspace_role(creator.id, ws.id, "admin")

        await AuditService(self._db).log(
            action="workspace.created",
            resource="workspace",
            resource_id=ws.id,
            user_id=creator.id,
            organization_id=org_id,
        )
        return ws

    async def get(self, workspace_id: str) -> Workspace:
        result = await self._db.execute(
            select(Workspace).where(Workspace.id == workspace_id, Workspace.deleted_at.is_(None))
        )
        ws = result.scalar_one_or_none()
        if ws is None:
            raise NotFoundError("Workspace")
        return ws

    async def list_for_org(self, org_id: str) -> list[Workspace]:
        result = await self._db.execute(
            select(Workspace).where(
                Workspace.organization_id == org_id,
                Workspace.deleted_at.is_(None),
            )
        )
        return list(result.scalars().all())

    async def update(
        self,
        ws: Workspace,
        *,
        name: str | None = None,
        description: str | None = None,
        actor: User,
    ) -> Workspace:
        if name is not None:
            ws.name = name
        if description is not None:
            ws.description = description

        await AuditService(self._db).log(
            action="workspace.updated",
            resource="workspace",
            resource_id=ws.id,
            user_id=actor.id,
            organization_id=ws.organization_id,
        )
        return ws

    async def soft_delete(self, ws: Workspace, actor: User) -> None:
        from datetime import datetime

        ws.deleted_at = datetime.now(UTC)
        await AuditService(self._db).log(
            action="workspace.deleted",
            resource="workspace",
            resource_id=ws.id,
            user_id=actor.id,
            organization_id=ws.organization_id,
        )

    async def list_members(self, workspace_id: str) -> list[WorkspaceMember]:
        result = await self._db.execute(
            select(WorkspaceMember).where(WorkspaceMember.workspace_id == workspace_id)
        )
        return list(result.scalars().all())

    async def add_member(
        self,
        workspace_id: str,
        user_id: str,
        role_name: str,
        actor: User,
    ) -> WorkspaceMember:
        rbac = RBACService(self._db)
        membership = await rbac.assign_workspace_role(user_id, workspace_id, role_name)
        await AuditService(self._db).log(
            action="workspace.member_added",
            resource="workspace_member",
            resource_id=membership.id,
            user_id=actor.id,
        )
        return membership

    async def remove_member(self, workspace_id: str, user_id: str, actor: User) -> None:
        result = await self._db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            raise NotFoundError("Workspace membership")
        await self._db.delete(membership)
        await AuditService(self._db).log(
            action="workspace.member_removed",
            resource="workspace_member",
            resource_id=membership.id,
            user_id=actor.id,
        )

    async def _assert_slug_free(self, org_id: str, slug: str) -> None:
        result = await self._db.execute(
            select(Workspace).where(
                Workspace.organization_id == org_id,
                Workspace.slug == slug,
                Workspace.deleted_at.is_(None),
            )
        )
        if result.scalar_one_or_none() is not None:
            raise ConflictError("A workspace with this slug already exists.", "slug_taken")
