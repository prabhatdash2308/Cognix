"""Auth routes — /api/v1/auth/"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Header, Request

from app.core.config import get_settings
from app.core.database import DbSession
from app.core.dependencies import CurrentUser
from app.core.rate_limit import limiter
from app.schemas.auth import (
    LoginRequest,
    LogoutRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.schemas.common import DataResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def _client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/register", response_model=DataResponse[TokenResponse], status_code=201)
@limiter.limit("5/minute")
async def register(
    request: Request,
    body: RegisterRequest,
    db: DbSession,
    user_agent: Annotated[str | None, Header()] = None,
) -> DataResponse[TokenResponse]:
    """Register a new user account and return tokens."""
    service = AuthService(db)
    _, access_token, refresh_token = await service.register(
        email=body.email,
        password=body.password,
        name=body.name,
        ip_address=_client_ip(request),
        user_agent=user_agent,
    )
    return DataResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_ttl,
        )
    )


@router.post("/login", response_model=DataResponse[TokenResponse])
@limiter.limit("10/minute")
async def login(
    request: Request,
    body: LoginRequest,
    db: DbSession,
    user_agent: Annotated[str | None, Header()] = None,
) -> DataResponse[TokenResponse]:
    """Authenticate and return access + refresh tokens."""
    service = AuthService(db)
    _, access_token, refresh_token = await service.login(
        email=body.email,
        password=body.password,
        remember_me=body.remember_me,
        ip_address=_client_ip(request),
        user_agent=user_agent,
    )
    return DataResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_ttl,
        )
    )


@router.post("/refresh", response_model=DataResponse[TokenResponse])
@limiter.limit("30/minute")
async def refresh(
    request: Request,
    body: RefreshRequest,
    db: DbSession,
    user_agent: Annotated[str | None, Header()] = None,
) -> DataResponse[TokenResponse]:
    """Rotate the refresh token and return a new token pair."""
    service = AuthService(db)
    access_token, refresh_token = await service.refresh(
        refresh_token=body.refresh_token,
        ip_address=_client_ip(request),
        user_agent=user_agent,
    )
    return DataResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_ttl,
        )
    )


@router.post("/logout", status_code=204)
async def logout(
    body: LogoutRequest,
    user: CurrentUser,
    db: DbSession,
) -> None:
    """Revoke the current session."""
    await AuthService(db).logout(user, body.refresh_token)


@router.post("/password-reset", status_code=204)
@limiter.limit("3/minute")
async def request_password_reset(
    request: Request,
    body: PasswordResetRequest,
    db: DbSession,
) -> None:
    """Send a password-reset email (stub: logs to console)."""
    await AuthService(db).request_password_reset(body.email)


@router.post("/password-reset/confirm", status_code=204)
@limiter.limit("5/minute")
async def confirm_password_reset(
    request: Request,
    body: PasswordResetConfirm,
    db: DbSession,
) -> None:
    """Validate reset token and update the password."""
    await AuthService(db).confirm_password_reset(body.token, body.new_password)


@router.post("/verify-email", response_model=DataResponse[UserResponse])
@limiter.limit("5/minute")
async def verify_email(
    request: Request,
    body: VerifyEmailRequest,
    db: DbSession,
) -> DataResponse[UserResponse]:
    """Mark the account email as verified."""
    user = await AuthService(db).verify_email(body.token)
    return DataResponse(data=UserResponse.model_validate(user))


@router.get("/me", response_model=DataResponse[UserResponse])
async def me(user: CurrentUser) -> DataResponse[UserResponse]:
    """Return the current authenticated user (lightweight; no DB hit)."""
    return DataResponse(data=UserResponse.model_validate(user))
