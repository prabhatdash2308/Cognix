"""Shared pytest fixtures and test database setup."""

from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator
from typing import Any

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import get_db
from app.main import app
from app.models.base import Base

# Use an in-memory SQLite database for tests (aiosqlite driver)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop_policy() -> asyncio.DefaultEventLoopPolicy:
    return asyncio.DefaultEventLoopPolicy()


@pytest_asyncio.fixture(scope="function", autouse=True)
async def disable_limiter():
    app.state.limiter.enabled = False


@pytest_asyncio.fixture(scope="function")
async def db_engine() -> AsyncGenerator[Any, None]:
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(db_engine: Any) -> AsyncGenerator[AsyncSession, None]:
    session_factory = async_sessionmaker(
        bind=db_engine, expire_on_commit=False, autoflush=False
    )
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """HTTP test client with DB dependency overridden to use test session."""
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        try:
            yield db_session
            await db_session.commit()
        except Exception:
            await db_session.rollback()
            raise

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ── Domain-level fixtures ─────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def seeded_roles(db_session: AsyncSession) -> None:
    """Seed system RBAC roles before tests that need them."""
    from app.services.rbac_service import RBACService
    await RBACService(db_session).seed_system_roles()
    await db_session.flush()


@pytest_asyncio.fixture
async def registered_user(client: AsyncClient, seeded_roles: None) -> dict[str, Any]:
    """Register a test user and return the token response + user info."""
    resp = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "Test1234",
        "name": "Test User",
    })
    assert resp.status_code == 201
    return resp.json()["data"]


@pytest_asyncio.fixture
async def auth_headers(registered_user: dict[str, Any]) -> dict[str, str]:
    return {"Authorization": f"Bearer {registered_user['access_token']}"}
