"""Project routes — /api/v1/projects/"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.project import (
    AddProjectMemberRequest,
    ProjectCreate,
    ProjectMemberResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=DataResponse[ProjectResponse], status_code=201)
async def create_project(
    workspace_id: str,
    body: ProjectCreate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectResponse]:
    """Create a project within a workspace."""
    project = await ProjectService(db).create(
        workspace_id=workspace_id,
        name=body.name,
        description=body.description,
        emoji=body.emoji,
        color=body.color,
        visibility=body.visibility,
        settings=body.settings,
        metadata=body.metadata,
        creator=user,
    )
    return DataResponse(data=ProjectResponse.model_validate(project))


@router.get("/{project_id}", response_model=DataResponse[ProjectResponse])
async def get_project(
    project_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectResponse]:
    project = await ProjectService(db).get(project_id)
    return DataResponse(data=ProjectResponse.model_validate(project))


@router.patch("/{project_id}", response_model=DataResponse[ProjectResponse])
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectResponse]:
    service = ProjectService(db)
    project = await service.get(project_id)

    updated = await service.update(
        project,
        name=body.name,
        description=body.description,
        emoji=body.emoji,
        color=body.color,
        visibility=body.visibility,
        status=body.status,
        settings=body.settings,
        metadata=body.metadata,
        actor=user,
    )
    return DataResponse(data=ProjectResponse.model_validate(updated))


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: str,
    user: CurrentUser,
    db: DbSession,
) -> None:
    service = ProjectService(db)
    project = await service.get(project_id)
    await service.soft_delete(project, user)


@router.post("/{project_id}/archive", response_model=DataResponse[ProjectResponse])
async def archive_project(
    project_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectResponse]:
    service = ProjectService(db)
    project = await service.get(project_id)
    archived = await service.archive(project, user)
    return DataResponse(data=ProjectResponse.model_validate(archived))


@router.post("/{project_id}/restore", response_model=DataResponse[ProjectResponse])
async def restore_project(
    project_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectResponse]:
    service = ProjectService(db)
    project = await service.get(project_id)
    restored = await service.restore(project, user)
    return DataResponse(data=ProjectResponse.model_validate(restored))


@router.get("/{project_id}/members", response_model=DataResponse[list[ProjectMemberResponse]])
async def list_project_members(
    project_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[list[ProjectMemberResponse]]:
    members = await ProjectService(db).list_members(project_id)
    responses: list[ProjectMemberResponse] = []
    for m in members:
        await db.refresh(m, ["user"])
        responses.append(ProjectMemberResponse.model_validate(m))
    return DataResponse(data=responses)


@router.post(
    "/{project_id}/members", response_model=DataResponse[ProjectMemberResponse], status_code=201
)
async def add_project_member(
    project_id: str,
    body: AddProjectMemberRequest,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[ProjectMemberResponse]:
    membership = await ProjectService(db).add_member(
        project_id=project_id,
        user_id=body.user_id,
        role=body.role,
        actor=user,
    )
    await db.refresh(membership, ["user"])
    return DataResponse(data=ProjectMemberResponse.model_validate(membership))


@router.delete("/{project_id}/members/{user_id}", status_code=204)
async def remove_project_member(
    project_id: str,
    user_id: str,
    user: CurrentUser,
    db: DbSession,
) -> None:
    await ProjectService(db).remove_member(project_id, user_id, user)
