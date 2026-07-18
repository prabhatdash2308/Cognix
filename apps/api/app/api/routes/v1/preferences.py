"""Preferences routes — /api/v1/preferences/"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.preference import PreferenceResponse, PreferenceUpdate
from app.services.preference_service import PreferenceService

router = APIRouter(prefix="/preferences", tags=["preferences"])


@router.get("/me", response_model=DataResponse[PreferenceResponse])
async def get_preferences(
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[PreferenceResponse]:
    """Return the current user's preferences (creates defaults if absent)."""
    pref = await PreferenceService(db).get_or_create(user.id)
    return DataResponse(data=PreferenceResponse.model_validate(pref))


@router.patch("/me", response_model=DataResponse[PreferenceResponse])
async def update_preferences(
    body: PreferenceUpdate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[PreferenceResponse]:
    """Partially update the current user's preferences."""
    pref = await PreferenceService(db).update(
        user.id,
        theme=body.theme,
        language=body.language,
        timezone=body.timezone,
        date_format=body.date_format,
        sidebar_collapsed=body.sidebar_collapsed,
        notification_prefs=body.notification_prefs,
    )
    return DataResponse(data=PreferenceResponse.model_validate(pref))
