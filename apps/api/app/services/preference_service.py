"""Preference service — get or create user preferences."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.preference import Preference


class PreferenceService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_or_create(self, user_id: str) -> Preference:
        result = await self._db.execute(
            select(Preference).where(Preference.user_id == user_id)
        )
        pref = result.scalar_one_or_none()
        if pref is None:
            pref = Preference(user_id=user_id)
            self._db.add(pref)
            await self._db.flush()
        return pref

    async def update(
        self,
        user_id: str,
        *,
        theme: str | None = None,
        language: str | None = None,
        timezone: str | None = None,
        date_format: str | None = None,
        sidebar_collapsed: bool | None = None,
        notification_prefs: dict[str, object] | None = None,
    ) -> Preference:
        pref = await self.get_or_create(user_id)

        if theme is not None:
            pref.theme = theme
        if language is not None:
            pref.language = language
        if timezone is not None:
            pref.timezone = timezone
        if date_format is not None:
            pref.date_format = date_format
        if sidebar_collapsed is not None:
            pref.sidebar_collapsed = sidebar_collapsed
        if notification_prefs is not None:
            pref.notification_prefs = notification_prefs

        return pref
