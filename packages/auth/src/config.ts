/** Configuration required to sign and verify Cognix tokens. */
export interface AuthConfig {
  /** Shared secret used to sign tokens (HS256). */
  secret: string;
  issuer: string;
  audience: string;
  /** Access-token lifetime in seconds. */
  accessTokenTtl: number;
}

/**
 * Build an {@link AuthConfig} from environment variables, failing fast when a
 * required value is missing.
 */
export function authConfigFromEnv(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const secret = env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long.");
  }

  return {
    secret,
    issuer: env.AUTH_JWT_ISSUER ?? "cognix",
    audience: env.AUTH_JWT_AUDIENCE ?? "cognix-app",
    accessTokenTtl: Number.parseInt(env.AUTH_ACCESS_TOKEN_TTL ?? "900", 10),
  };
}
