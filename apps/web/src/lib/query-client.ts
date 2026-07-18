/**
 * TanStack Query client configuration.
 * Retries once, treats 401/403/404 as non-retryable errors.
 */
import { QueryClient } from "@tanstack/react-query";

function isNonRetryableError(error: unknown): boolean {
  if (error instanceof Error && "status" in error) {
    const status = (error as { status?: number }).status;
    return status === 401 || status === 403 || status === 404;
  }
  return false;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          if (isNonRetryableError(error)) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
