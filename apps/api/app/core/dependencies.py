"""FastAPI dependency factories for auth and authorization."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import InsufficientPermissionsError, InvalidTokenError, UnauthorizedError
from app.core.security import decode_access_token
from app.models.membership import OrganizationMember
from app.models.role import Permission, Role, RolePermission
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Extract and validate the bearer token; return the authenticated User.

    Raises:
        UnauthorizedError: No token provided.
        InvalidTokenError: Token is malformed or expired.
        UnauthorizedError: User no longer exists or is suspended.
    """
    if credentials is None:
        raise UnauthorizedError()

    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise InvalidTokenError()

    user_id: str = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
    user = result.scalar_one_or_none()

    if user is None:
        raise UnauthorizedError("User account not found.")
    if user.status == "suspended":
        raise UnauthorizedError("Account suspended.")

    return user


# Convenient annotation for route handlers
CurrentUser = Annotated[User, Depends(get_current_user)]


async def _get_user_permissions(
    user_id: str,
    organization_id: str,
    db: AsyncSession,
) -> set[str]:
    """Return a set of permission keys for a user within an organization."""
    result = await db.execute(
        select(Permission)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .join(Role, Role.id == RolePermission.role_id)
        .join(
            OrganizationMember,
            (OrganizationMember.role_id == Role.id)
            & (OrganizationMember.user_id == user_id)
            & (OrganizationMember.organization_id == organization_id),
        )
    )
    return {perm.key for perm in result.scalars().all()}


def require_permission(permission_key: str):  # type: ignore[no-untyped-def]
    """Return a dependency that asserts the current user has *permission_key*.

    Usage::

        @router.post("/projects")
        async def create_project(
            org_id: str,
            user: CurrentUser,
            _: Annotated[None, Depends(require_permission("projects.write"))],
        ): ...

    Note: This simplified version checks the user's org role in the first org
    they belong to. For workspace-level RBAC inject the workspace_id explicitly.
    """
    async def _check(
        user: CurrentUser,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> None:
        # Fetch first org membership to derive permission context
        result = await db.execute(
            select(OrganizationMember).where(OrganizationMember.user_id == user.id).limit(1)
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            raise ForbiddenError()  # type: ignore[name-defined]  # noqa: F821

        perms = await _get_user_permissions(user.id, membership.organization_id, db)
        if permission_key not in perms:
            raise InsufficientPermissionsError(permission_key)

    return _check


def require_org_member(role_names: list[str] | None = None):  # type: ignore[no-untyped-def]
    """Return a dependency that asserts the user is a member of the org.

    Optionally validates that their role name is one of *role_names*.
    The ``org_id`` must be a path parameter in the route.
    """
    async def _check(
        org_id: str,
        user: CurrentUser,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> OrganizationMember:
        result = await db.execute(
            select(OrganizationMember)
            .where(
                OrganizationMember.organization_id == org_id,
                OrganizationMember.user_id == user.id,
            )
        )
        membership = result.scalar_one_or_none()
        if membership is None:
            raise InsufficientPermissionsError()

        if role_names is not None:
            await db.refresh(membership, ["role"])
            if membership.role.name not in role_names:
                raise InsufficientPermissionsError()

        return membership

    return _check
