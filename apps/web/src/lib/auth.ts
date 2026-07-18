/**
 * Token storage utilities.
 * Access tokens → memory (no XSS-readable localStorage).
 * Refresh tokens → httpOnly cookie via server action (production-grade).
 *
 * For client-side prototype: refresh token is stored in sessionStorage.
 * Replace with a Next.js Server Action cookie proxy before production.
 */

export const REFRESH_TOKEN_KEY = "cognix_refresh_token";

/** In-memory access token store (cleared on page refresh — intentional). */
let _accessToken: string | null = null;

export function setAccessToken(token: string): void {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function clearAccessToken(): void {
  _accessToken = null;
}

/** Refresh token stored in sessionStorage (swap for httpOnly cookie in prod). */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

export function clearRefreshToken(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function storeTokens(pair: TokenPair): void {
  setAccessToken(pair.access_token);
  setRefreshToken(pair.refresh_token);
}
