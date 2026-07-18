"""RBAC models — Role, Permission, RolePermission."""

from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Permission(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A single, granular permission key like ``projects.read``.

    Permissions are seeded on startup and never deleted; they grow as
    features are added.
    """

    __tablename__ = "permissions"

    resource: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    role_permissions: Mapped[list[RolePermission]] = relationship(
        back_populates="permission", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("resource", "action", name="uq_permission_resource_action"),)

    @property
    def key(self) -> str:
        """Return the dot-notation key, e.g. ``projects.read``."""
        return f"{self.resource}.{self.action}"

    def __repr__(self) -> str:
        return f"<Permission {self.key!r}>"


class Role(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A named collection of permissions.

    System roles (is_system=True) are seeded on startup and shared
    across all organizations. Custom roles have an organization_id.
    """

    __tablename__ = "roles"

    organization_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_system: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Precedence level — higher = more privileged (owner=100, guest=10)
    precedence: Mapped[int] = mapped_column(default=10, nullable=False)

    organization: Mapped[Organization | None] = relationship(back_populates="roles")  # type: ignore[name-defined]  # noqa: F821
    role_permissions: Mapped[list[RolePermission]] = relationship(
        back_populates="role", cascade="all, delete-orphan"
    )
    org_memberships: Mapped[list[OrganizationMember]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="role"
    )
    workspace_memberships: Mapped[list[WorkspaceMember]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="role"
    )

    def __repr__(self) -> str:
        return f"<Role id={self.id!r} name={self.name!r}>"


class RolePermission(Base):
    """Many-to-many association between Role and Permission."""

    __tablename__ = "role_permissions"

    role_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    permission_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    )

    role: Mapped[Role] = relationship(back_populates="role_permissions")
    permission: Mapped[Permission] = relationship(back_populates="role_permissions")

    def __repr__(self) -> str:
        return f"<RolePermission role={self.role_id!r} perm={self.permission_id!r}>"
