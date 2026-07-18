"""Organization model."""

from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Organization(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    """A tenant — the top-level billing and identity boundary."""

    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    logo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    plan: Mapped[str] = mapped_column(String(50), nullable=False, default="free")

    members: Mapped[list[OrganizationMember]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="organization", cascade="all, delete-orphan"
    )
    workspaces: Mapped[list[Workspace]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="organization", cascade="all, delete-orphan"
    )
    roles: Mapped[list[Role]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="organization", cascade="all, delete-orphan"
    )
    invitations: Mapped[list[Invitation]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="organization", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[list[AuditLog]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="organization"
    )

    def __repr__(self) -> str:
        return f"<Organization id={self.id!r} slug={self.slug!r}>"
