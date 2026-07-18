"""Invitation schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import EmailStr

from app.schemas.common import CognixModel


class InviteRequest(CognixModel):
    email: EmailStr
    role_name: str = "member"
    workspace_id: str | None = None


class InvitationResponse(CognixModel):
    id: str
    organization_id: str
    workspace_id: str | None
    email: str
    status: str
    expires_at: datetime
    created_at: datetime


class AcceptInvitationRequest(CognixModel):
    token: str
