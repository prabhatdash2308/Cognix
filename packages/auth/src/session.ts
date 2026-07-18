import type { MembershipRole, OrganizationId, UserId } from "@cognix/types";

/** Claims embedded in a Cognix access token. */
export interface SessionClaims {
  /** Subject — the authenticated user id. */
  sub: UserId;
  /** Active organization for the session. */
  org: OrganizationId;
  /** Role of the user within the active organization. */
  role: MembershipRole;
}

/** A verified, authenticated session derived from a valid access token. */
export interface Session extends SessionClaims {
  /** Token issued-at, in seconds since the epoch. */
  issuedAt: number;
  /** Token expiry, in seconds since the epoch. */
  expiresAt: number;
}
