"""Organization service."""

from __future__ import annotations

import logging

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, SlugAlreadyTakenError
from app.models.membership import OrganizationMember
from app.models.organization import Organization
from app.models.user import User
from app.services.audit_service import AuditService
from app.services.rbac_service import RBACService

logger = logging.getLogger(__name__)


class OrganizationService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(self, name: str, creator: User) -> Organization:
        """Create a new organization and set the creator as Owner."""
        slug = slugify(name, max_length=80)
        await self._assert_slug_free(slug)

        org = Organization(name=name, slug=slug)
        self._db.add(org)
        await self._db.flush()

        # Assign creator as Owner
        rbac = RBACService(self._db)
        await rbac.assign_org_role(creator.id, org.id, "owner")

        await AuditService(self._db).log(
            action="organization.created",
            resource="organization",
            resource_id=org.id,
            user_id=creator.id,
            organization_id=org.id,
        )
        logger.info("Organization created: %s by %s", org.id, creator.id)
        return org

    async def get(self, org_id: str) -> Organization:
        result = await self._db.execute(
            select(Organization).where(Organization.id == org_id, Organization.deleted_at.is_(None))
        )
        org = result.scalar_one_or_none()
        if org is None:
            raise NotFoundError("Organization")
        return org

    async def get_by_slug(self, slug: str) -> Organization:
        result = await self._db.execute(
            select(Organization).where(Organization.slug == slug, Organization.deleted_at.is_(None))
        )
        org = result.scalar_one_or_none()
        if org is None:
            raise NotFoundError("Organization")
        return org

    async def update(
        self,
        org: Organization,
        *,
        name: str | None = None,
        slug: str | None = None,
        logo_url: str | None = None,
        actor: User,
    ) -> Organization:
        if slug is not None and slug != org.slug:
            await self._assert_slug_free(slug)
            org.slug = slug
        if name is not None:
            org.name = name
        if logo_url is not None:
            org.logo_url = logo_url

        await AuditService(self._db).log(
            action="organization.updated",
            resource="organization",
            resource_id=org.id,
            user_id=actor.id,
            organization_id=org.id,
        )
        return org

    async def list_members(self, org_id: str) -> list[OrganizationMember]:
        result = await self._db.execute(
            select(OrganizationMember).where(OrganizationMember.organization_id == org_id)
        )
        return list(result.scalars().all())

    async def remove_member(self, org_id: str, user_id: str, actor: User) -> None:
        result = await self._db.execute(
            select(OrganizationMember).where(
                OrganizationMember.organization_id == org_id,
                OrganizationMember.user_id == user_id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            raise NotFoundError("Membership")

        await self._db.delete(membership)
        await AuditService(self._db).log(
            action="organization.member_removed",
            resource="organization_member",
            resource_id=membership.id,
            user_id=actor.id,
            organization_id=org_id,
            metadata={"removed_user_id": user_id},
        )

    # ─── Helpers ──────────────────────────────────────────────────────────────

    async def _assert_slug_free(self, slug: str) -> None:
        result = await self._db.execute(
            select(Organization).where(Organization.slug == slug, Organization.deleted_at.is_(None))
        )
        if result.scalar_one_or_none() is not None:
            raise SlugAlreadyTakenError("organization slug")
