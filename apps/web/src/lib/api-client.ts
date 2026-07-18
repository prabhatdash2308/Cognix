/**
 * Singleton CognixClient configured from env vars.
 * Use this in client components and hooks; Server Components should use
 * server-side fetch with credentials from cookies.
 */
import { CognixClient } from "@cognix/sdk";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = new CognixClient({ baseUrl });

/** Create a client with an explicit bearer token (for authenticated requests). */
export function createAuthClient(token: string): CognixClient {
  return new CognixClient({ baseUrl, token });
}
