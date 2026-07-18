import { jwtVerify, SignJWT } from "jose";

import type { AuthConfig } from "./config.js";
import type { Session, SessionClaims } from "./session.js";

function secretKey(config: AuthConfig): Uint8Array {
  return new TextEncoder().encode(config.secret);
}

/** Sign a short-lived access token embedding the given session claims. */
export async function signAccessToken(claims: SessionClaims, config: AuthConfig): Promise<string> {
  return new SignJWT({ org: claims.org, role: claims.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setIssuedAt()
    .setExpirationTime(`${config.accessTokenTtl}s`)
    .sign(secretKey(config));
}

/**
 * Verify an access token and return the resulting {@link Session}.
 * Throws if the token is invalid, expired, or fails audience/issuer checks.
 */
export async function verifyAccessToken(token: string, config: AuthConfig): Promise<Session> {
  const { payload } = await jwtVerify(token, secretKey(config), {
    issuer: config.issuer,
    audience: config.audience,
  });

  if (!payload.sub || typeof payload.org !== "string" || typeof payload.role !== "string") {
    throw new Error("Access token is missing required claims.");
  }

  return {
    sub: payload.sub as Session["sub"],
    org: payload.org as Session["org"],
    role: payload.role as Session["role"],
    issuedAt: payload.iat ?? 0,
    expiresAt: payload.exp ?? 0,
  };
}
