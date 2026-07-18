"""Session model — tracks active refresh-token grants."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Session(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Persisted refresh token grant.

    The refresh token itself is never stored; only its Argon2 hash is kept
    so that even a DB breach cannot be used to forge tokens.
    """

    __tablename__ = "sessions"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    refresh_token_hash: Mapped[str] = mapped_column(Text, nullable=False)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(nullable=True)
    remember_me: Mapped[bool] = mapped_column(default=False, nullable=False)

    user: Mapped[User] = relationship(back_populates="sessions")  # type: ignore[name-defined]  # noqa: F821

    @property
    def is_active(self) -> bool:
        from datetime import datetime

        now = datetime.now(UTC).replace(tzinfo=None)

        # Ensure self.expires_at is naive for comparison
        expires_at = (
            self.expires_at.replace(tzinfo=None) if self.expires_at.tzinfo else self.expires_at
        )
        return self.revoked_at is None and expires_at > now

    def __repr__(self) -> str:
        return f"<Session id={self.id!r} user_id={self.user_id!r}>"
