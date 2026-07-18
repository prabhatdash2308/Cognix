"""Common Pydantic schemas — pagination and error envelopes."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class CognixModel(BaseModel):
    """Base model with shared config for all Cognix schemas."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DataResponse(CognixModel, Generic[T]):
    """Standard success envelope: ``{"data": ...}``."""

    data: T


class PaginatedResponse(CognixModel, Generic[T]):
    """Cursor-paginated list response."""

    items: list[T]
    next_cursor: str | None = None
    total: int | None = None


class ErrorDetail(CognixModel):
    code: str
    message: str
    details: dict[str, list[str]] | None = None


class ErrorResponse(CognixModel):
    error: ErrorDetail
