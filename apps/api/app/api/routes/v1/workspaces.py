"""Workspace routes — /api/v1/workspaces/"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.workspace import (
    AddMemberRequest,
    WorkspaceCreate,
    WorkspaceMemberResponse,
    WorkspaceResponse,
    WorkspaceUpdate,
)
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("/", response_model=DataResponse[WorkspaceResponse], status_code=201)
async def create_workspace(
    body: WorkspaceCreate,
    org_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[WorkspaceResponse]:
    """Create a workspace within an organization."""
    ws = await WorkspaceService(db).create(
        org_id=org_id,
        name=body.name,
        description=body.description,
        creator=user,
    )
    return DataResponse(data=WorkspaceResponse.model_validate(ws))


@router.get("/{workspace_id}", response_model=DataResponse[WorkspaceResponse])
async def get_workspace(
    workspace_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[WorkspaceResponse]:
    ws = await WorkspaceService(db).get(workspace_id)
    return DataResponse(data=WorkspaceResponse.model_validate(ws))


@router.patch("/{workspace_id}", response_model=DataResponse[WorkspaceResponse])
async def update_workspace(
    workspace_id: str,
    body: WorkspaceUpdate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[WorkspaceResponse]:
    service = WorkspaceService(db)
    ws = await service.get(workspace_id)
    updated = await service.update(ws, name=body.name, description=body.description, actor=user)
    return DataResponse(data=WorkspaceResponse.model_validate(updated))


@router.delete("/{workspace_id}", status_code=204)
async def delete_workspace(
    workspace_id: str,
    user: CurrentUser,
    db: DbSession,
) -> None:
    service = WorkspaceService(db)
    ws = await service.get(workspace_id)
    await service.soft_delete(ws, user)


@router.get("/{workspace_id}/members", response_model=DataResponse[list[WorkspaceMemberResponse]])
async def list_workspace_members(
    workspace_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[list[WorkspaceMemberResponse]]:
    members = await WorkspaceService(db).list_members(workspace_id)
    responses: list[WorkspaceMemberResponse] = []
    for m in members:
        await db.refresh(m, ["user", "role"])
        responses.append(WorkspaceMemberResponse.model_validate(m))
    return DataResponse(data=responses)


@router.post(
    "/{workspace_id}/members", response_model=DataResponse[WorkspaceMemberResponse], status_code=201
)
async def add_workspace_member(
    workspace_id: str,
    body: AddMemberRequest,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[WorkspaceMemberResponse]:
    membership = await WorkspaceService(db).add_member(
        workspace_id=workspace_id,
        user_id=body.user_id,
        role_name=body.role_name,
        actor=user,
    )
    await db.refresh(membership, ["user", "role"])
    return DataResponse(data=WorkspaceMemberResponse.model_validate(membership))


@router.delete("/{workspace_id}/members/{user_id}", status_code=204)
async def remove_workspace_member(
    workspace_id: str,
    user_id: str,
    user: CurrentUser,
    db: DbSession,
) -> None:
    await WorkspaceService(db).remove_member(workspace_id, user_id, user)
