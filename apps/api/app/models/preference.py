"""Preference model — per-user UI and notification settings."""

from __future__ import annotations

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Preference(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """One-to-one with User; stores all personalisation state."""

    __tablename__ = "preferences"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    theme: Mapped[str] = mapped_column(String(20), nullable=False, default="system")
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    timezone: Mapped[str] = mapped_column(String(60), nullable=False, default="UTC")
    date_format: Mapped[str] = mapped_column(String(30), nullable=False, default="DD/MM/YYYY")
    sidebar_collapsed: Mapped[bool] = mapped_column(nullable=False, default=False)

    # Free-form JSON for extensible notification and command-palette prefs
    notification_prefs: Mapped[dict[str, object]] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), nullable=False, default=dict
    )

    user: Mapped[User] = relationship(back_populates="preferences")  # type: ignore[name-defined]  # noqa: F821

    def __repr__(self) -> str:
        return f"<Preference user_id={self.user_id!r}>"
