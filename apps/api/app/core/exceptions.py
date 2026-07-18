"""Application-level HTTP exceptions with consistent error envelopes."""

from __future__ import annotations

from fastapi import HTTPException, status


class CognixException(HTTPException):
    """Base Cognix API exception that includes a machine-readable error code."""

    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message},
        )


# ─── 400 Bad Request ──────────────────────────────────────────────────────────

class BadRequestError(CognixException):
    def __init__(self, message: str = "Bad request", code: str = "bad_request") -> None:
        super().__init__(status.HTTP_400_BAD_REQUEST, code, message)


# ─── 401 Unauthorized ─────────────────────────────────────────────────────────

class UnauthorizedError(CognixException):
    def __init__(self, message: str = "Authentication required", code: str = "unauthorized") -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, code, message)


class InvalidCredentialsError(CognixException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_401_UNAUTHORIZED,
            "invalid_credentials",
            "Invalid email or password.",
        )


class TokenExpiredError(CognixException):
    def __init__(self) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, "token_expired", "Token has expired.")


class InvalidTokenError(CognixException):
    def __init__(self) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, "invalid_token", "Token is invalid.")


# ─── 403 Forbidden ────────────────────────────────────────────────────────────

class ForbiddenError(CognixException):
    def __init__(self, message: str = "Access denied", code: str = "forbidden") -> None:
        super().__init__(status.HTTP_403_FORBIDDEN, code, message)


class InsufficientPermissionsError(CognixException):
    def __init__(self, permission: str | None = None) -> None:
        msg = f"Missing permission: {permission}" if permission else "Insufficient permissions."
        super().__init__(status.HTTP_403_FORBIDDEN, "insufficient_permissions", msg)


# ─── 404 Not Found ────────────────────────────────────────────────────────────

class NotFoundError(CognixException):
    def __init__(self, resource: str = "Resource") -> None:
        super().__init__(
            status.HTTP_404_NOT_FOUND,
            "not_found",
            f"{resource} not found.",
        )


# ─── 409 Conflict ─────────────────────────────────────────────────────────────

class ConflictError(CognixException):
    def __init__(self, message: str, code: str = "conflict") -> None:
        super().__init__(status.HTTP_409_CONFLICT, code, message)


class EmailAlreadyRegisteredError(CognixException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_409_CONFLICT,
            "email_taken",
            "An account with this email address already exists.",
        )


class SlugAlreadyTakenError(CognixException):
    def __init__(self, resource: str = "slug") -> None:
        super().__init__(
            status.HTTP_409_CONFLICT,
            "slug_taken",
            f"The {resource} is already taken. Please choose another.",
        )


# ─── 410 Gone ─────────────────────────────────────────────────────────────────

class InvitationExpiredError(CognixException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_410_GONE,
            "invitation_expired",
            "This invitation has expired or is no longer valid.",
        )


# ─── 422 Unprocessable ────────────────────────────────────────────────────────

class ValidationError(CognixException):
    def __init__(self, message: str) -> None:
        super().__init__(status.HTTP_422_UNPROCESSABLE_ENTITY, "validation_error", message)
