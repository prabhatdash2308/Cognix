"""Membership models — OrganizationMember and WorkspaceMember."""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class OrganizationMember(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Binds a user to an organization with a specific role."""

    __tablename__ = "organization_members"

    organization_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    organization: Mapped[Organization] = relationship(back_populates="members")  # type: ignore[name-defined]  # noqa: F821
    user: Mapped[User] = relationship(back_populates="org_memberships")  # type: ignore[name-defined]  # noqa: F821
    role: Mapped[Role] = relationship(back_populates="org_memberships")  # type: ignore[name-defined]  # noqa: F821

    __table_args__ = (
        UniqueConstraint("organization_id", "user_id", name="uq_org_member"),
    )

    def __repr__(self) -> str:
        return f"<OrganizationMember org={self.organization_id!r} user={self.user_id!r}>"


class WorkspaceMember(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Binds a user to a workspace with a workspace-scoped role."""

    __tablename__ = "workspace_members"

    workspace_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    role_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
    )

    workspace: Mapped[Workspace] = relationship(back_populates="members")  # type: ignore[name-defined]  # noqa: F821
    user: Mapped[User] = relationship(back_populates="workspace_memberships")  # type: ignore[name-defined]  # noqa: F821
    role: Mapped[Role] = relationship(back_populates="workspace_memberships")  # type: ignore[name-defined]  # noqa: F821

    __table_args__ = (
        UniqueConstraint("workspace_id", "user_id", name="uq_workspace_member"),
    )

    def __repr__(self) -> str:
        return f"<WorkspaceMember ws={self.workspace_id!r} user={self.user_id!r}>"
