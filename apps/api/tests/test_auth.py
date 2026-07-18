"""Auth endpoint tests."""

from __future__ import annotations

from typing import Any

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_register_success(client: AsyncClient, seeded_roles: None) -> None:
    resp = await client.post("/api/v1/auth/register", json={
        "email": "alice@example.com",
        "password": "Alice1234",
        "name": "Alice",
    })
    assert resp.status_code == 201
    data = resp.json()["data"]
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


async def test_register_duplicate_email(client: AsyncClient, registered_user: dict[str, Any]) -> None:
    resp = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "Test1234",
        "name": "Duplicate",
    })
    assert resp.status_code == 409
    assert resp.json()["detail"]["code"] == "email_taken"


async def test_register_weak_password(client: AsyncClient, seeded_roles: None) -> None:
    resp = await client.post("/api/v1/auth/register", json={
        "email": "weak@example.com",
        "password": "password",  # no digit
        "name": "Weak",
    })
    assert resp.status_code == 422


async def test_login_success(client: AsyncClient, registered_user: dict[str, Any]) -> None:
    resp = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "Test1234",
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert "access_token" in data


async def test_login_wrong_password(client: AsyncClient, registered_user: dict[str, Any]) -> None:
    resp = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "WrongPass1",
    })
    assert resp.status_code == 401
    assert resp.json()["detail"]["code"] == "invalid_credentials"


async def test_refresh_token(client: AsyncClient, registered_user: dict[str, Any]) -> None:
    resp = await client.post("/api/v1/auth/refresh", json={
        "refresh_token": registered_user["refresh_token"],
    })
    assert resp.status_code == 200
    new_data = resp.json()["data"]
    assert "access_token" in new_data
    # Old refresh token must be invalidated
    resp2 = await client.post("/api/v1/auth/refresh", json={
        "refresh_token": registered_user["refresh_token"],
    })
    assert resp2.status_code == 401


async def test_get_me(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    resp = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["email"] == "test@example.com"


async def test_logout(
    client: AsyncClient,
    registered_user: dict[str, Any],
    auth_headers: dict[str, str],
) -> None:
    resp = await client.post(
        "/api/v1/auth/logout",
        json={"refresh_token": registered_user["refresh_token"]},
        headers=auth_headers,
    )
    assert resp.status_code == 204
    # Refresh token should now be invalid
    resp2 = await client.post("/api/v1/auth/refresh", json={
        "refresh_token": registered_user["refresh_token"],
    })
    assert resp2.status_code == 401


async def test_password_reset_flow(client: AsyncClient, registered_user: dict[str, Any], db_session: Any) -> None:
    # Request reset
    resp = await client.post("/api/v1/auth/password-reset", json={"email": "test@example.com"})
    assert resp.status_code == 204

    # Fetch token from DB (in real life this comes via email)
    from sqlalchemy import select

    from app.models.user import User
    result = await db_session.execute(select(User).where(User.email == "test@example.com"))
    user = result.scalar_one()
    token = user.password_reset_token
    assert token is not None

    # Confirm reset
    resp2 = await client.post("/api/v1/auth/password-reset/confirm", json={
        "token": token,
        "new_password": "NewPass5678",
    })
    assert resp2.status_code == 204

    # Old token should be gone
    resp3 = await client.post("/api/v1/auth/password-reset/confirm", json={
        "token": token,
        "new_password": "AnotherPass9",
    })
    assert resp3.status_code == 401

    # Login with new password
    resp4 = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "NewPass5678",
    })
    assert resp4.status_code == 200
