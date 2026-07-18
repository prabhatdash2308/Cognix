"""Application configuration."""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings loaded from the environment.

    Values are read from environment variables (and an optional local `.env`).
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---
    app_name: str = "cognix-api"
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    # --- CORS ---
    cors_origins: str = "http://localhost:3000"

    # --- Database ---
    database_url: str = "postgresql+asyncpg://cognix:cognix@localhost:5432/cognix"

    # --- Redis ---
    redis_url: str = "redis://localhost:6379/0"

    # --- JWT ---
    jwt_secret: str = "change-me-to-a-long-random-secret"
    jwt_issuer: str = "cognix"
    jwt_audience: str = "cognix-app"
    jwt_algorithm: str = "HS256"
    access_token_ttl: int = 900       # seconds — 15 minutes
    refresh_token_ttl: int = 1_209_600  # seconds — 14 days

    # --- Email (stub) ---
    smtp_from: str = "noreply@cognix.app"
    smtp_host: str = "localhost"
    smtp_port: int = 587

    # --- Invitation ---
    invitation_ttl: int = 604_800  # 7 days in seconds

    # --- Rate limiting ---
    rate_limit_default: str = "60/minute"
    rate_limit_auth: str = "10/minute"

    @property
    def cors_origin_list(self) -> list[str]:
        """Return CORS origins as a parsed list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance."""
    return Settings()
