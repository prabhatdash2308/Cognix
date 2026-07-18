/**
 * Auth and session types for the Cognix platform.
 */
import type { UserId } from "./user.js";

export interface TokenResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly token_type: "bearer";
  readonly expires_in: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface LogoutRequest {
  refresh_token?: string;
}

export type SessionUserId = UserId;
