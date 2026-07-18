"""Preference endpoint tests."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_get_preferences_creates_defaults(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    resp = await client.get("/api/v1/preferences/me", headers=auth_headers)
    assert resp.status_code == 200
    prefs = resp.json()["data"]
    assert prefs["theme"] == "system"
    assert prefs["language"] == "en"
    assert prefs["timezone"] == "UTC"
    assert prefs["sidebar_collapsed"] is False


async def test_update_preferences(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    resp = await client.patch(
        "/api/v1/preferences/me",
        json={"theme": "dark", "language": "es", "sidebar_collapsed": True},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    prefs = resp.json()["data"]
    assert prefs["theme"] == "dark"
    assert prefs["language"] == "es"
    assert prefs["sidebar_collapsed"] is True


async def test_invalid_theme(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    resp = await client.patch(
        "/api/v1/preferences/me",
        json={"theme": "neon"},
        headers=auth_headers,
    )
    assert resp.status_code == 422


async def test_update_notification_prefs(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    prefs = {"email_mentions": True, "email_assignments": False, "push_all": True}
    resp = await client.patch(
        "/api/v1/preferences/me",
        json={"notification_prefs": prefs},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["notification_prefs"] == prefs
