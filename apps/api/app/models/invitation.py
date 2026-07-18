"""Invitation model."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Invitation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Email invitation to join an organization (and optionally a workspace).

    Status flow: pending → accepted | rejected | expired | cancelled
    """

    __tablename__ = "invitations"

    organization_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    workspace_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("workspaces.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    role_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
    )
    invited_by_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # One-time token delivered by email
    token: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    expires_at: Mapped[datetime] = mapped_column(nullable=False)

    organization: Mapped[Organization] = relationship(back_populates="invitations")  # type: ignore[name-defined]  # noqa: F821
    workspace: Mapped[Workspace | None] = relationship(back_populates="invitations")  # type: ignore[name-defined]  # noqa: F821
    invited_by: Mapped[User] = relationship()  # type: ignore[name-defined]  # noqa: F821
    role: Mapped[Role] = relationship()  # type: ignore[name-defined]  # noqa: F821

    def __repr__(self) -> str:
        return f"<Invitation id={self.id!r} email={self.email!r} status={self.status!r}>"
