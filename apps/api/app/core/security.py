"""Security utilities — password hashing, JWT encoding/decoding."""

from __future__ import annotations

import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

# ─── Password hashing ─────────────────────────────────────────────────────────

_pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return the Argon2 hash of a plain-text password."""
    return _pwd_context.hash(plain)  # type: ignore[no-any-return]


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches the Argon2 *hashed* password."""
    return _pwd_context.verify(plain, hashed)  # type: ignore[no-any-return]


def needs_rehash(hashed: str) -> bool:
    """Return True if the stored hash should be upgraded."""
    return _pwd_context.needs_update(hashed)  # type: ignore[no-any-return]


# ─── Token helpers ────────────────────────────────────────────────────────────


def generate_secure_token(nbytes: int = 32) -> str:
    """Return a URL-safe, cryptographically secure random token string."""
    return secrets.token_urlsafe(nbytes)


# ─── JWT ──────────────────────────────────────────────────────────────────────


def create_access_token(
    subject: str,
    extra_claims: dict[str, Any] | None = None,
    ttl: int | None = None,
) -> str:
    """Encode a short-lived access JWT.

    Args:
        subject: The user ID this token represents.
        extra_claims: Additional claims to embed (e.g. ``org_id``).
        ttl: Override the default access token TTL (seconds).
    """
    now = datetime.now(UTC)
    expire = now + timedelta(seconds=ttl or settings.access_token_ttl)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": expire,
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "type": "access",
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str, session_id: str, remember_me: bool = False) -> str:
    """Encode a longer-lived refresh JWT tied to a specific session record."""
    now = datetime.now(UTC)
    ttl = settings.refresh_token_ttl * (4 if remember_me else 1)
    expire = now + timedelta(seconds=ttl)
    payload: dict[str, Any] = {
        "sub": subject,
        "sid": session_id,
        "iat": now,
        "exp": expire,
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "type": "refresh",
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT, raising JWTError on any failure."""
    return jwt.decode(  # type: ignore[no-any-return]
        token,
        settings.jwt_secret,
        algorithms=[settings.jwt_algorithm],
        audience=settings.jwt_audience,
        issuer=settings.jwt_issuer,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and assert the token is an access token."""
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise JWTError("Not an access token")
    return payload


def decode_refresh_token(token: str) -> dict[str, Any]:
    """Decode and assert the token is a refresh token."""
    payload = decode_token(token)
    if payload.get("type") != "refresh":
        raise JWTError("Not a refresh token")
    return payload
