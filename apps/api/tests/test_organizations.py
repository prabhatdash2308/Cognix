"""Organization endpoint tests."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_create_organization(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    resp = await client.post(
        "/api/v1/organizations/",
        json={"name": "Acme Corp"},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    org = resp.json()["data"]
    assert org["name"] == "Acme Corp"
    assert org["slug"] == "acme-corp"


async def test_create_org_duplicate_slug(
    client: AsyncClient, auth_headers: dict[str, str]
) -> None:
    await client.post("/api/v1/organizations/", json={"name": "Dup Org"}, headers=auth_headers)
    resp = await client.post(
        "/api/v1/organizations/", json={"name": "Dup Org"}, headers=auth_headers
    )
    assert resp.status_code == 409


async def test_get_organization(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    create_resp = await client.post(
        "/api/v1/organizations/", json={"name": "Test Org"}, headers=auth_headers
    )
    org_id = create_resp.json()["data"]["id"]
    resp = await client.get(f"/api/v1/organizations/{org_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["id"] == org_id


async def test_update_organization(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    create_resp = await client.post(
        "/api/v1/organizations/", json={"name": "Old Name"}, headers=auth_headers
    )
    org_id = create_resp.json()["data"]["id"]
    resp = await client.patch(
        f"/api/v1/organizations/{org_id}",
        json={"name": "New Name"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["name"] == "New Name"


async def test_list_org_members(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    create_resp = await client.post(
        "/api/v1/organizations/", json={"name": "Member Org"}, headers=auth_headers
    )
    org_id = create_resp.json()["data"]["id"]
    resp = await client.get(f"/api/v1/organizations/{org_id}/members", headers=auth_headers)
    assert resp.status_code == 200
    members = resp.json()["data"]
    assert len(members) == 1  # creator is the owner
    assert members[0]["role"]["name"] == "owner"
