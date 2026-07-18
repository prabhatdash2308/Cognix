import type { ApiError } from "@cognix/types";

/** Thrown when the Cognix API returns a non-2xx response. */
export class CognixApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiError["details"];

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = "CognixApiError";
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}
