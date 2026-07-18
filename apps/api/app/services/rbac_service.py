"""RBAC service — seeds system roles/permissions and checks access."""

from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.membership import OrganizationMember, WorkspaceMember
from app.models.role import Permission, Role, RolePermission

logger = logging.getLogger(__name__)

# ─── Seed Data ────────────────────────────────────────────────────────────────

# All platform permissions (resource, action, description)
SYSTEM_PERMISSIONS: list[tuple[str, str, str]] = [
    # Projects
    ("projects", "read", "View projects"),
    ("projects", "write", "Create and edit projects"),
    ("projects", "delete", "Delete projects"),
    # Tasks
    ("tasks", "read", "View tasks"),
    ("tasks", "create", "Create tasks"),
    ("tasks", "write", "Edit tasks"),
    ("tasks", "delete", "Delete tasks"),
    ("tasks", "assign", "Assign tasks to users or agents"),
    # Documents
    ("documents", "read", "View documents"),
    ("documents", "write", "Create and edit documents"),
    ("documents", "delete", "Delete documents"),
    # Agents
    ("agents", "read", "View AI agents"),
    ("agents", "manage", "Create, edit, and configure agents"),
    ("agents", "delete", "Delete agents"),
    # Knowledge
    ("knowledge", "read", "View knowledge entries"),
    ("knowledge", "write", "Create and edit knowledge entries"),
    ("knowledge", "delete", "Delete knowledge entries"),
    # Automation
    ("automation", "read", "View automation workflows"),
    ("automation", "manage", "Create and edit automation workflows"),
    # Members
    ("members", "read", "View workspace members"),
    ("members", "manage", "Invite and manage workspace members"),
    ("members", "remove", "Remove members from workspace"),
    # Workspace
    ("workspace", "read", "View workspace settings"),
    ("workspace", "manage", "Edit workspace settings"),
    ("workspace", "delete", "Delete workspace"),
    # Organization
    ("organization", "read", "View organization settings"),
    ("organization", "manage", "Edit organization settings"),
    ("organization", "billing", "Manage billing"),
    ("organization", "delete", "Delete organization"),
    # Invitations
    ("invitations", "create", "Send invitations"),
    ("invitations", "revoke", "Cancel invitations"),
    # Roles
    ("roles", "read", "View roles"),
    ("roles", "manage", "Create and edit custom roles"),
]

# (role_name, is_system, precedence, description, permission_keys)
SYSTEM_ROLES: list[tuple[str, bool, int, str, list[str]]] = [
    (
        "owner",
        True,
        100,
        "Full control over the organization.",
        [f"{r}.{a}" for r, a, _ in SYSTEM_PERMISSIONS],  # All permissions
    ),
    (
        "admin",
        True,
        80,
        "Manage most aspects except billing and org deletion.",
        [
            "projects.read",
            "projects.write",
            "projects.delete",
            "tasks.read",
            "tasks.create",
            "tasks.write",
            "tasks.delete",
            "tasks.assign",
            "documents.read",
            "documents.write",
            "documents.delete",
            "agents.read",
            "agents.manage",
            "agents.delete",
            "knowledge.read",
            "knowledge.write",
            "knowledge.delete",
            "automation.read",
            "automation.manage",
            "members.read",
            "members.manage",
            "members.remove",
            "workspace.read",
            "workspace.manage",
            "workspace.delete",
            "organization.read",
            "organization.manage",
            "invitations.create",
            "invitations.revoke",
            "roles.read",
            "roles.manage",
        ],
    ),
    (
        "manager",
        True,
        60,
        "Manage projects, tasks, and documents within their workspaces.",
        [
            "projects.read",
            "projects.write",
            "tasks.read",
            "tasks.create",
            "tasks.write",
            "tasks.assign",
            "documents.read",
            "documents.write",
            "agents.read",
            "knowledge.read",
            "knowledge.write",
            "automation.read",
            "members.read",
            "workspace.read",
            "invitations.create",
        ],
    ),
    (
        "member",
        True,
        40,
        "Standard contributor with read/write access to content.",
        [
            "projects.read",
            "tasks.read",
            "tasks.create",
            "tasks.write",
            "documents.read",
            "documents.write",
            "agents.read",
            "knowledge.read",
            "members.read",
            "workspace.read",
        ],
    ),
    (
        "guest",
        True,
        10,
        "Read-only access to shared content.",
        [
            "projects.read",
            "tasks.read",
            "documents.read",
            "knowledge.read",
            "workspace.read",
        ],
    ),
]


class RBACService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    # ─── Seeding ──────────────────────────────────────────────────────────────

    async def seed_system_roles(self) -> None:
        """Idempotently create all system permissions and roles."""
        # Upsert permissions
        perm_map: dict[str, Permission] = {}
        for resource, action, description in SYSTEM_PERMISSIONS:
            result = await self._db.execute(
                select(Permission).where(
                    Permission.resource == resource,
                    Permission.action == action,
                )
            )
            perm = result.scalar_one_or_none()
            if perm is None:
                perm = Permission(resource=resource, action=action, description=description)
                self._db.add(perm)
                await self._db.flush()
            perm_map[perm.key] = perm

        # Upsert roles
        for name, is_system, precedence, description, perm_keys in SYSTEM_ROLES:
            result = await self._db.execute(
                select(Role).where(Role.name == name, Role.is_system.is_(True))
            )
            role = result.scalar_one_or_none()
            if role is None:
                role = Role(
                    name=name,
                    is_system=is_system,
                    precedence=precedence,
                    description=description,
                )
                self._db.add(role)
                await self._db.flush()

            # Sync permissions for this role
            existing_result = await self._db.execute(
                select(RolePermission).where(RolePermission.role_id == role.id)
            )
            existing_perm_ids = {rp.permission_id for rp in existing_result.scalars().all()}

            for key in perm_keys:
                if key in perm_map:
                    perm = perm_map[key]
                    if perm.id not in existing_perm_ids:
                        self._db.add(RolePermission(role_id=role.id, permission_id=perm.id))

        await self._db.flush()
        logger.info("RBAC system roles seeded.")

    # ─── Lookups ──────────────────────────────────────────────────────────────

    async def get_role_by_name(self, name: str) -> Role | None:
        result = await self._db.execute(
            select(Role).where(Role.name == name, Role.is_system.is_(True))
        )
        return result.scalar_one_or_none()

    async def get_user_org_permissions(self, user_id: str, org_id: str) -> set[str]:
        """Return all permission keys the user holds in the given organization."""
        result = await self._db.execute(
            select(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .join(Role, Role.id == RolePermission.role_id)
            .join(
                OrganizationMember,
                (OrganizationMember.role_id == Role.id)
                & (OrganizationMember.user_id == user_id)
                & (OrganizationMember.organization_id == org_id),
            )
        )
        return {p.key for p in result.scalars().all()}

    async def get_user_workspace_permissions(self, user_id: str, workspace_id: str) -> set[str]:
        """Return permission keys from the user's workspace-scoped role."""
        result = await self._db.execute(
            select(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .join(Role, Role.id == RolePermission.role_id)
            .join(
                WorkspaceMember,
                (WorkspaceMember.role_id == Role.id)
                & (WorkspaceMember.user_id == user_id)
                & (WorkspaceMember.workspace_id == workspace_id),
            )
        )
        return {p.key for p in result.scalars().all()}

    async def check_org_permission(self, user_id: str, org_id: str, permission: str) -> bool:
        perms = await self.get_user_org_permissions(user_id, org_id)
        return permission in perms

    async def check_workspace_permission(
        self, user_id: str, workspace_id: str, permission: str
    ) -> bool:
        perms = await self.get_user_workspace_permissions(user_id, workspace_id)
        return permission in perms

    # ─── Assignment ───────────────────────────────────────────────────────────

    async def assign_org_role(
        self, user_id: str, org_id: str, role_name: str
    ) -> OrganizationMember:
        role = await self.get_role_by_name(role_name)
        if role is None:
            raise ValueError(f"System role '{role_name}' not found. Did you seed?")

        result = await self._db.execute(
            select(OrganizationMember).where(
                OrganizationMember.user_id == user_id,
                OrganizationMember.organization_id == org_id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            membership = OrganizationMember(
                user_id=user_id, organization_id=org_id, role_id=role.id
            )
            self._db.add(membership)
        else:
            membership.role_id = role.id

        await self._db.flush()
        return membership

    async def assign_workspace_role(
        self, user_id: str, workspace_id: str, role_name: str
    ) -> WorkspaceMember:
        role = await self.get_role_by_name(role_name)
        if role is None:
            raise ValueError(f"System role '{role_name}' not found. Did you seed?")

        result = await self._db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.user_id == user_id,
                WorkspaceMember.workspace_id == workspace_id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            membership = WorkspaceMember(
                user_id=user_id, workspace_id=workspace_id, role_id=role.id
            )
            self._db.add(membership)
        else:
            membership.role_id = role.id

        await self._db.flush()
        return membership
