"""AuditLog model — immutable record of significant platform events."""

from __future__ import annotations

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin


class AuditLog(UUIDPrimaryKeyMixin, Base):
    """Append-only audit trail.

    No ``updated_at`` — audit records are immutable.
    ``created_at`` is handled by the DB default.
    """

    __tablename__ = "audit_logs"

    from datetime import datetime

    from sqlalchemy import DateTime, func

    created_at: Mapped[datetime] = mapped_column(  # type: ignore[misc]
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    organization_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    user_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    metadata_: Mapped[dict[str, object]] = mapped_column(
        "metadata", JSON().with_variant(JSONB, "postgresql"), nullable=False, default=dict
    )
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)

    organization: Mapped[Organization | None] = relationship(back_populates="audit_logs")  # type: ignore[name-defined]  # noqa: F821
    user: Mapped[User | None] = relationship(back_populates="audit_logs")  # type: ignore[name-defined]  # noqa: F821

    def __repr__(self) -> str:
        return f"<AuditLog action={self.action!r} resource={self.resource!r}>"
