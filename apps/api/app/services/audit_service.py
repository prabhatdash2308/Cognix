"""Audit log service — append-only event recording."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


class AuditService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def log(
        self,
        *,
        action: str,
        resource: str,
        resource_id: str | None = None,
        user_id: str | None = None,
        organization_id: str | None = None,
        ip_address: str | None = None,
        metadata: dict[str, object] | None = None,
    ) -> AuditLog:
        """Append an immutable audit record."""
        entry = AuditLog(
            action=action,
            resource=resource,
            resource_id=resource_id,
            user_id=user_id,
            organization_id=organization_id,
            ip_address=ip_address,
            metadata_=metadata or {},
        )
        self._db.add(entry)
        await self._db.flush()
        return entry
