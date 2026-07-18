"""Auth request/response schemas."""

from __future__ import annotations

from pydantic import EmailStr, Field, field_validator

from app.schemas.common import CognixModel


class RegisterRequest(CognixModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=200)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        has_letter = any(c.isalpha() for c in v)
        has_digit = any(c.isdigit() for c in v)
        if not (has_letter and has_digit):
            raise ValueError("Password must contain at least one letter and one number.")
        return v


class LoginRequest(CognixModel):
    email: EmailStr
    password: str = Field(min_length=1)
    remember_me: bool = False


class TokenResponse(CognixModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # access token TTL in seconds


class RefreshRequest(CognixModel):
    refresh_token: str


class PasswordResetRequest(CognixModel):
    email: EmailStr


class PasswordResetConfirm(CognixModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        has_letter = any(c.isalpha() for c in v)
        has_digit = any(c.isdigit() for c in v)
        if not (has_letter and has_digit):
            raise ValueError("Password must contain at least one letter and one number.")
        return v


class VerifyEmailRequest(CognixModel):
    token: str


class LogoutRequest(CognixModel):
    refresh_token: str | None = None
