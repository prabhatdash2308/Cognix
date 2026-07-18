"""Organization routes — /api/v1/organizations/"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.organization import MemberResponse, OrgCreate, OrgResponse, OrgUpdate
from app.services.organization_service import OrganizationService

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.post("/", response_model=DataResponse[OrgResponse], status_code=201)
async def create_organization(
    body: OrgCreate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[OrgResponse]:
    """Create a new organization. The caller becomes Owner."""
    org = await OrganizationService(db).create(name=body.name, creator=user)
    return DataResponse(data=OrgResponse.model_validate(org))


@router.get("/{org_id}", response_model=DataResponse[OrgResponse])
async def get_organization(
    org_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[OrgResponse]:
    org = await OrganizationService(db).get(org_id)
    return DataResponse(data=OrgResponse.model_validate(org))


@router.patch("/{org_id}", response_model=DataResponse[OrgResponse])
async def update_organization(
    org_id: str,
    body: OrgUpdate,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[OrgResponse]:
    service = OrganizationService(db)
    org = await service.get(org_id)
    updated = await service.update(
        org,
        name=body.name,
        slug=body.slug,
        logo_url=body.logo_url,
        actor=user,
    )
    return DataResponse(data=OrgResponse.model_validate(updated))


@router.get("/{org_id}/members", response_model=DataResponse[list[MemberResponse]])
async def list_members(
    org_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[list[MemberResponse]]:
    members = await OrganizationService(db).list_members(org_id)
    # Eager-load user and role for each member
    responses: list[MemberResponse] = []
    for m in members:
        await db.refresh(m, ["user", "role"])
        responses.append(MemberResponse.model_validate(m))
    return DataResponse(data=responses)


@router.delete("/{org_id}/members/{user_id}", status_code=204)
async def remove_member(
    org_id: str,
    user_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    await OrganizationService(db).remove_member(org_id, user_id, current_user)
