"""Preference schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.schemas.common import CognixModel


class PreferenceResponse(CognixModel):
    id: str
    user_id: str
    theme: str
    language: str
    timezone: str
    date_format: str
    sidebar_collapsed: bool
    notification_prefs: dict[str, object]
    updated_at: datetime


class PreferenceUpdate(CognixModel):
    theme: str | None = Field(default=None, pattern=r"^(light|dark|system)$")
    language: str | None = Field(default=None, min_length=2, max_length=10)
    timezone: str | None = Field(default=None, min_length=1, max_length=60)
    date_format: str | None = Field(default=None, min_length=1, max_length=30)
    sidebar_collapsed: bool | None = None
    notification_prefs: dict[str, object] | None = None
