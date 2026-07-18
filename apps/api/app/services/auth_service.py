"""Authentication service — register, login, refresh, logout, password reset."""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    InvalidTokenError,
    UnauthorizedError,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    generate_secure_token,
    hash_password,
    needs_rehash,
    verify_password,
)
from app.models.session import Session
from app.models.user import User
from app.services.audit_service import AuditService
from app.services.preference_service import PreferenceService

logger = logging.getLogger(__name__)
settings = get_settings()


class AuthService:
    """Stateless service — all methods receive a db session explicitly."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    # ─── Register ─────────────────────────────────────────────────────────────

    async def register(
        self,
        email: str,
        password: str,
        name: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[User, str, str]:
        """Create a new user account.

        Returns:
            (user, access_token, refresh_token)
        """
        existing = await self._db.execute(select(User).where(User.email == email))
        if existing.scalar_one_or_none() is not None:
            raise EmailAlreadyRegisteredError()

        user = User(
            email=email.lower().strip(),
            name=name.strip(),
            password_hash=hash_password(password),
            status="active",
        )
        self._db.add(user)
        await self._db.flush()  # get user.id before creating session

        # Create default preferences
        pref_service = PreferenceService(self._db)
        await pref_service.get_or_create(user.id)

        access_token, refresh_token = await self._create_tokens(
            user, remember_me=False, ip_address=ip_address, user_agent=user_agent
        )

        await AuditService(self._db).log(
            action="auth.register",
            resource="user",
            resource_id=user.id,
            user_id=user.id,
            ip_address=ip_address,
        )

        logger.info("User registered: %s", user.id)
        return user, access_token, refresh_token

    # ─── Login ────────────────────────────────────────────────────────────────

    async def login(
        self,
        email: str,
        password: str,
        remember_me: bool = False,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[User, str, str]:
        """Authenticate and return (user, access_token, refresh_token)."""
        result = await self._db.execute(
            select(User).where(User.email == email.lower().strip(), User.deleted_at.is_(None))
        )
        user = result.scalar_one_or_none()

        if user is None or user.password_hash is None:
            raise InvalidCredentialsError()
        if not verify_password(password, user.password_hash):
            await AuditService(self._db).log(
                action="auth.login_failed",
                resource="user",
                resource_id=user.id,
                user_id=user.id,
                ip_address=ip_address,
            )
            raise InvalidCredentialsError()
        if user.status == "suspended":
            raise UnauthorizedError("Account suspended.")

        # Upgrade hash if needed (transparent rehash)
        if needs_rehash(user.password_hash):
            user.password_hash = hash_password(password)

        access_token, refresh_token = await self._create_tokens(
            user, remember_me=remember_me, ip_address=ip_address, user_agent=user_agent
        )

        await AuditService(self._db).log(
            action="auth.login",
            resource="user",
            resource_id=user.id,
            user_id=user.id,
            ip_address=ip_address,
        )

        return user, access_token, refresh_token

    # ─── Refresh ──────────────────────────────────────────────────────────────

    async def refresh(
        self,
        refresh_token: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[str, str]:
        """Rotate the refresh token; return (new_access_token, new_refresh_token).

        The old session record is revoked and a new one is created (rotation).
        """
        from jose import JWTError

        from app.core.security import decode_refresh_token

        try:
            payload = decode_refresh_token(refresh_token)
        except JWTError:
            raise InvalidTokenError() from None

        session_id: str = payload["sid"]
        user_id: str = payload["sub"]

        result = await self._db.execute(
            select(Session).where(Session.id == session_id, Session.user_id == user_id)
        )
        session = result.scalar_one_or_none()

        if session is None or not session.is_active:
            raise InvalidTokenError()

        # Verify the presented token hashes to the stored hash
        if not verify_password(refresh_token, session.refresh_token_hash):
            # Potential token reuse attack — revoke the session
            session.revoked_at = datetime.now(UTC)
            raise InvalidTokenError()

        # Revoke old session (rotation)
        session.revoked_at = datetime.now(UTC)

        # Fetch user
        user_result = await self._db.execute(
            select(User).where(User.id == user_id, User.deleted_at.is_(None))
        )
        user = user_result.scalar_one_or_none()
        if user is None or user.status == "suspended":
            raise UnauthorizedError()

        access_token, new_refresh_token = await self._create_tokens(
            user,
            remember_me=session.remember_me,
            ip_address=ip_address or session.ip_address,
            user_agent=user_agent or session.user_agent,
        )
        return access_token, new_refresh_token

    # ─── Logout ───────────────────────────────────────────────────────────────

    async def logout(self, user: User, refresh_token: str | None = None) -> None:
        """Revoke the current session (or all sessions if no token given)."""
        if refresh_token:
            from jose import JWTError

            from app.core.security import decode_refresh_token

            try:
                payload = decode_refresh_token(refresh_token)
                session_id = payload.get("sid")
                result = await self._db.execute(
                    select(Session).where(Session.id == session_id, Session.user_id == user.id)
                )
                session = result.scalar_one_or_none()
                if session and session.revoked_at is None:
                    session.revoked_at = datetime.now(UTC)
            except JWTError:
                pass  # Token already invalid — nothing to revoke

        await AuditService(self._db).log(
            action="auth.logout",
            resource="user",
            resource_id=user.id,
            user_id=user.id,
        )

    # ─── Password Reset ───────────────────────────────────────────────────────

    async def request_password_reset(self, email: str) -> None:
        """Generate a password-reset token and (stub) send email."""
        result = await self._db.execute(
            select(User).where(User.email == email.lower().strip(), User.deleted_at.is_(None))
        )
        user = result.scalar_one_or_none()
        # Always return success to avoid leaking which emails are registered
        if user is None:
            return

        token = generate_secure_token(32)
        user.password_reset_token = token
        user.password_reset_expires_at = datetime.now(UTC) + timedelta(hours=1)

        # STUB: log email instead of sending
        logger.info(
            "[EMAIL STUB] Password reset link for %s: /reset-password?token=%s",
            email,
            token,
        )

    async def confirm_password_reset(self, token: str, new_password: str) -> None:
        """Validate reset token and update the password."""
        result = await self._db.execute(select(User).where(User.password_reset_token == token))
        user = result.scalar_one_or_none()

        if user is None or user.password_reset_expires_at is None:
            raise InvalidTokenError()
        now = datetime.now(UTC).replace(tzinfo=None)
        expires_at = (
            user.password_reset_expires_at.replace(tzinfo=None)
            if user.password_reset_expires_at.tzinfo
            else user.password_reset_expires_at
        )
        if expires_at < now:
            raise InvalidTokenError()

        user.password_hash = hash_password(new_password)
        user.password_reset_token = None
        user.password_reset_expires_at = None

        # Revoke all active sessions for security
        sessions_result = await self._db.execute(
            select(Session).where(Session.user_id == user.id, Session.revoked_at.is_(None))
        )
        for s in sessions_result.scalars().all():
            s.revoked_at = datetime.now(UTC)

        await AuditService(self._db).log(
            action="auth.password_reset",
            resource="user",
            resource_id=user.id,
            user_id=user.id,
        )

    # ─── Email Verification ───────────────────────────────────────────────────

    async def request_email_verification(self, user: User) -> None:
        """Generate a verification token and (stub) send verification email."""
        token = generate_secure_token(32)
        user.password_reset_token = token  # reuse field for simplicity
        user.password_reset_expires_at = datetime.now(UTC) + timedelta(hours=24)
        logger.info(
            "[EMAIL STUB] Email verification for %s: /verify-email?token=%s",
            user.email,
            token,
        )

    async def verify_email(self, token: str) -> User:
        """Mark the user's email as verified."""
        result = await self._db.execute(select(User).where(User.password_reset_token == token))
        user = result.scalar_one_or_none()

        if user is None or user.password_reset_expires_at is None:
            raise InvalidTokenError()
        if user.password_reset_expires_at < datetime.now(UTC):
            raise InvalidTokenError()

        user.email_verified_at = datetime.now(UTC)
        user.password_reset_token = None
        user.password_reset_expires_at = None
        return user

    # ─── Private helpers ──────────────────────────────────────────────────────

    async def _create_tokens(
        self,
        user: User,
        remember_me: bool,
        ip_address: str | None,
        user_agent: str | None,
    ) -> tuple[str, str]:
        raw_refresh = generate_secure_token(48)
        ttl = settings.refresh_token_ttl * (4 if remember_me else 1)
        expires_at = datetime.now(UTC) + timedelta(seconds=ttl)

        session = Session(
            user_id=user.id,
            refresh_token_hash=hash_password(raw_refresh),
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=expires_at,
            remember_me=remember_me,
        )
        self._db.add(session)
        await self._db.flush()  # get session.id

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(
            subject=user.id, session_id=session.id, remember_me=remember_me
        )

        # Store hash of the JWT (not the raw token)
        session.refresh_token_hash = hash_password(refresh_token)

        return access_token, refresh_token
