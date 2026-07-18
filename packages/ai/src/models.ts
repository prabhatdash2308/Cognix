/**
 * Supported Claude models. Prefer referencing these constants over string
 * literals so model upgrades happen in one place.
 */
export const CLAUDE_MODELS = {
  /** Most capable — deep reasoning and complex agentic work. */
  opus: "claude-opus-4-8",
  /** Balanced default — strong quality at production latency and cost. */
  sonnet: "claude-sonnet-5",
  /** Fastest and cheapest — high-volume, latency-sensitive tasks. */
  haiku: "claude-haiku-4-5-20251001",
} as const;

export type ClaudeModel = (typeof CLAUDE_MODELS)[keyof typeof CLAUDE_MODELS];

/** Default model used when a caller does not specify one. */
export const DEFAULT_MODEL: ClaudeModel = CLAUDE_MODELS.sonnet;

/** Resolve a model id from an environment variable, falling back to the default. */
export function resolveModel(value: string | undefined): ClaudeModel | string {
  return value && value.length > 0 ? value : DEFAULT_MODEL;
}
