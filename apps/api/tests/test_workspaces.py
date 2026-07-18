"""Workspace endpoint tests."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


@pytest.fixture
async def org_id(client: AsyncClient, auth_headers: dict[str, str]) -> str:
    resp = await client.post(
        "/api/v1/organizations/", json={"name": "WS Test Org"}, headers=auth_headers
    )
    return resp.json()["data"]["id"]


async def test_create_workspace(
    client: AsyncClient, auth_headers: dict[str, str], org_id: str
) -> None:
    resp = await client.post(
        "/api/v1/workspaces/",
        json={"name": "Engineering", "description": "Engineering workspace"},
        params={"org_id": org_id},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    ws = resp.json()["data"]
    assert ws["name"] == "Engineering"
    assert ws["slug"] == "engineering"
    assert ws["organization_id"] == org_id


async def test_get_workspace(
    client: AsyncClient, auth_headers: dict[str, str], org_id: str
) -> None:
    create_resp = await client.post(
        "/api/v1/workspaces/",
        json={"name": "Product"},
        params={"org_id": org_id},
        headers=auth_headers,
    )
    ws_id = create_resp.json()["data"]["id"]
    resp = await client.get(f"/api/v1/workspaces/{ws_id}", headers=auth_headers)
    assert resp.status_code == 200


async def test_update_workspace(
    client: AsyncClient, auth_headers: dict[str, str], org_id: str
) -> None:
    create_resp = await client.post(
        "/api/v1/workspaces/",
        json={"name": "Design"},
        params={"org_id": org_id},
        headers=auth_headers,
    )
    ws_id = create_resp.json()["data"]["id"]
    resp = await client.patch(
        f"/api/v1/workspaces/{ws_id}",
        json={"description": "UI/UX team"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["description"] == "UI/UX team"


async def test_delete_workspace(
    client: AsyncClient, auth_headers: dict[str, str], org_id: str
) -> None:
    create_resp = await client.post(
        "/api/v1/workspaces/",
        json={"name": "Temp"},
        params={"org_id": org_id},
        headers=auth_headers,
    )
    ws_id = create_resp.json()["data"]["id"]
    resp = await client.delete(f"/api/v1/workspaces/{ws_id}", headers=auth_headers)
    assert resp.status_code == 204
    # Should return 404 after soft delete
    resp2 = await client.get(f"/api/v1/workspaces/{ws_id}", headers=auth_headers)
    assert resp2.status_code == 404


async def test_workspace_members(
    client: AsyncClient, auth_headers: dict[str, str], org_id: str
) -> None:
    create_resp = await client.post(
        "/api/v1/workspaces/",
        json={"name": "Data"},
        params={"org_id": org_id},
        headers=auth_headers,
    )
    ws_id = create_resp.json()["data"]["id"]
    resp = await client.get(f"/api/v1/workspaces/{ws_id}/members", headers=auth_headers)
    assert resp.status_code == 200
    members = resp.json()["data"]
    assert len(members) == 1  # creator
    assert members[0]["role"]["name"] == "admin"
