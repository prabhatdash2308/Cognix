/**
 * Transport types shared between the Cognix API and its clients.
 */

/** Standard error payload returned by the API. */
export interface ApiError {
  /** Stable, machine-readable error code (e.g. `not_found`). */
  code: string;
  /** Human-readable description. */
  message: string;
  /** Optional field-level validation details. */
  details?: Record<string, readonly string[]>;
}

/** Successful response envelope. */
export interface ApiSuccess<T> {
  data: T;
}

/** Discriminated response envelope. */
export type ApiResponse<T> = ApiSuccess<T> | { error: ApiError };

/** Cursor-based pagination request. */
export interface PageRequest {
  cursor?: string;
  limit?: number;
}

/** Cursor-based pagination response. */
export interface Page<T> {
  items: readonly T[];
  nextCursor: string | null;
}

export function isApiError<T>(response: ApiResponse<T>): response is { error: ApiError } {
  return "error" in response;
}
