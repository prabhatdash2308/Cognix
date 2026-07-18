"""Workspace model — scoped environment within an organization."""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Workspace(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    """A workspace is a scoped collaboration area within an organization.

    Each workspace can have its own set of members, projects, documents,
    agents, and automation pipelines.
    """

    __tablename__ = "workspaces"

    organization_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    organization: Mapped[Organization] = relationship(back_populates="workspaces")  # type: ignore[name-defined]  # noqa: F821
    members: Mapped[list[WorkspaceMember]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="workspace", cascade="all, delete-orphan"
    )
    invitations: Mapped[list[Invitation]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="workspace"
    )

    def __repr__(self) -> str:
        return f"<Workspace id={self.id!r} slug={self.slug!r}>"
