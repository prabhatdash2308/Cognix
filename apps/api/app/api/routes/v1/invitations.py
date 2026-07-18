"""Invitation routes — /api/v1/invitations/"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.schemas.common import DataResponse
from app.schemas.invitation import AcceptInvitationRequest, InvitationResponse, InviteRequest
from app.schemas.organization import MemberResponse
from app.services.invitation_service import InvitationService

router = APIRouter(prefix="/invitations", tags=["invitations"])


@router.post("/", response_model=DataResponse[InvitationResponse], status_code=201)
async def invite(
    org_id: str,
    body: InviteRequest,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[InvitationResponse]:
    """Send an invitation email to join the organization."""
    invitation = await InvitationService(db).invite(
        org_id=org_id,
        email=body.email,
        role_name=body.role_name,
        invited_by=user,
        workspace_id=body.workspace_id,
    )
    return DataResponse(data=InvitationResponse.model_validate(invitation))


@router.get("/by-token/{token}", response_model=DataResponse[InvitationResponse])
async def get_invitation_by_token(
    token: str,
    db: DbSession,
) -> DataResponse[InvitationResponse]:
    """Look up an invitation by its one-time token (no auth required)."""
    invitation = await InvitationService(db).get_by_token(token)
    return DataResponse(data=InvitationResponse.model_validate(invitation))


@router.post("/accept", response_model=DataResponse[MemberResponse])
async def accept_invitation(
    body: AcceptInvitationRequest,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[MemberResponse]:
    """Accept an invitation; the authenticated user joins the organization."""
    membership = await InvitationService(db).accept(body.token, user)
    await db.refresh(membership, ["user", "role"])
    return DataResponse(data=MemberResponse.model_validate(membership))


@router.post("/{invitation_id}/reject", status_code=204)
async def reject_invitation(
    invitation_id: str,
    user: CurrentUser,
    db: DbSession,
) -> None:
    # Look up by ID, then pass token through service
    from sqlalchemy import select

    from app.models.invitation import Invitation as InvModel

    result = await db.execute(select(InvModel).where(InvModel.id == invitation_id))
    inv = result.scalar_one_or_none()
    if inv is None:
        from app.core.exceptions import NotFoundError

        raise NotFoundError("Invitation")
    await InvitationService(db).reject(inv.token, user)


@router.post("/{invitation_id}/resend", response_model=DataResponse[InvitationResponse])
async def resend_invitation(
    invitation_id: str,
    user: CurrentUser,
    db: DbSession,
) -> DataResponse[InvitationResponse]:
    invitation = await InvitationService(db).resend(invitation_id, user)
    return DataResponse(data=InvitationResponse.model_validate(invitation))
