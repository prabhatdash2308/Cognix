"""Invitation service — invite, accept, reject, resend, expire."""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import BadRequestError, InvitationExpiredError, NotFoundError
from app.core.security import generate_secure_token
from app.models.invitation import Invitation
from app.models.membership import OrganizationMember
from app.models.user import User
from app.services.audit_service import AuditService
from app.services.rbac_service import RBACService

logger = logging.getLogger(__name__)
settings = get_settings()


class InvitationService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def invite(
        self,
        org_id: str,
        email: str,
        role_name: str,
        invited_by: User,
        workspace_id: str | None = None,
    ) -> Invitation:
        """Create (or reactivate) an invitation for *email*."""
        rbac = RBACService(self._db)
        role = await rbac.get_role_by_name(role_name)
        if role is None:
            raise BadRequestError(f"Unknown role: {role_name}")

        # Check if there's already a pending invitation
        result = await self._db.execute(
            select(Invitation).where(
                Invitation.organization_id == org_id,
                Invitation.email == email.lower().strip(),
                Invitation.status == "pending",
            )
        )
        existing = result.scalar_one_or_none()
        if existing is not None:
            raise BadRequestError("A pending invitation already exists for this email.")

        token = generate_secure_token(32)
        expires_at = datetime.now(UTC) + timedelta(seconds=settings.invitation_ttl)

        invitation = Invitation(
            organization_id=org_id,
            workspace_id=workspace_id,
            email=email.lower().strip(),
            role_id=role.id,
            invited_by_id=invited_by.id,
            token=token,
            status="pending",
            expires_at=expires_at,
        )
        self._db.add(invitation)
        await self._db.flush()

        # STUB: log instead of sending email
        logger.info(
            "[EMAIL STUB] Invitation for %s to org %s: /join?token=%s",
            email,
            org_id,
            token,
        )

        await AuditService(self._db).log(
            action="invitation.sent",
            resource="invitation",
            resource_id=invitation.id,
            user_id=invited_by.id,
            organization_id=org_id,
            metadata={"email": email, "role": role_name},
        )
        return invitation

    async def get_by_token(self, token: str) -> Invitation:
        result = await self._db.execute(
            select(Invitation).where(Invitation.token == token)
        )
        invitation = result.scalar_one_or_none()
        if invitation is None:
            raise NotFoundError("Invitation")
        return invitation

    async def accept(self, token: str, accepting_user: User) -> OrganizationMember:
        invitation = await self.get_by_token(token)
        self._validate_pending(invitation)

        rbac = RBACService(self._db)

        # Grant org membership
        await self._db.refresh(invitation, ["role"])
        role_name = invitation.role.name
        membership = await rbac.assign_org_role(
            accepting_user.id, invitation.organization_id, role_name
        )

        # Grant workspace membership if specified
        if invitation.workspace_id:
            await rbac.assign_workspace_role(
                accepting_user.id, invitation.workspace_id, role_name
            )

        invitation.status = "accepted"

        await AuditService(self._db).log(
            action="invitation.accepted",
            resource="invitation",
            resource_id=invitation.id,
            user_id=accepting_user.id,
            organization_id=invitation.organization_id,
        )
        return membership

    async def reject(self, token: str, user: User) -> None:
        invitation = await self.get_by_token(token)
        self._validate_pending(invitation)
        invitation.status = "rejected"

        await AuditService(self._db).log(
            action="invitation.rejected",
            resource="invitation",
            resource_id=invitation.id,
            user_id=user.id,
        )

    async def resend(self, invitation_id: str, actor: User) -> Invitation:
        result = await self._db.execute(
            select(Invitation).where(Invitation.id == invitation_id)
        )
        invitation = result.scalar_one_or_none()
        if invitation is None:
            raise NotFoundError("Invitation")
        if invitation.status not in ("pending", "expired"):
            raise BadRequestError("Only pending or expired invitations can be resent.")

        invitation.token = generate_secure_token(32)
        invitation.status = "pending"
        invitation.expires_at = (
            datetime.now(UTC) + timedelta(seconds=settings.invitation_ttl)
        )

        logger.info(
            "[EMAIL STUB] Resent invitation for %s: /join?token=%s",
            invitation.email,
            invitation.token,
        )
        return invitation

    async def expire_old_invitations(self) -> int:
        """Mark all past-expiry pending invitations as expired. Returns count."""
        result = await self._db.execute(
            select(Invitation).where(
                Invitation.status == "pending",
                Invitation.expires_at < datetime.now(UTC),
            )
        )
        invitations = result.scalars().all()
        for inv in invitations:
            inv.status = "expired"
        return len(invitations)

    # ─── Helpers ──────────────────────────────────────────────────────────────

    def _validate_pending(self, invitation: Invitation) -> None:
        if invitation.status != "pending":
            raise BadRequestError(f"Invitation is already {invitation.status}.")
        if invitation.expires_at < datetime.now(UTC):
            invitation.status = "expired"
            raise InvitationExpiredError()
