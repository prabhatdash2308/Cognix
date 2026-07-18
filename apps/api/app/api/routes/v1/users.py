"""User routes — /api/v1/users/"""

from __future__ import annotations

from datetime import UTC

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=DataResponse[UserResponse])
async def get_me(user: CurrentUser, db: DbSession) -> DataResponse[UserResponse]:
    """Return the current user's full profile."""
    await db.refresh(user)
    return DataResponse(data=UserResponse.model_validate(user))


@router.patch("/me", response_model=DataResponse[UserResponse])
async def update_me(
    body: UserUpdate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[UserResponse]:
    """Update the current user's name or avatar."""
    if body.name is not None:
        user.name = body.name
    if body.avatar_url is not None:
        user.avatar_url = body.avatar_url
    await db.flush()
    return DataResponse(data=UserResponse.model_validate(user))


@router.delete("/me", status_code=204)
async def delete_me(user: CurrentUser, db: DbSession) -> None:
    """Soft-delete the current user account."""
    from datetime import datetime

    user.deleted_at = datetime.now(UTC)
    user.status = "suspended"
    await db.flush()
