import Anthropic from "@anthropic-ai/sdk";

import { DEFAULT_MODEL, resolveModel } from "./models.js";

/** Options for constructing a {@link CognixAI} client. */
export interface CognixAIOptions {
  /** Anthropic API key. Defaults to `ANTHROPIC_API_KEY`. */
  apiKey?: string;
  /** Default model id. Defaults to `COGNIX_AI_DEFAULT_MODEL` or the SDK default. */
  defaultModel?: string;
}

/** A single turn in a conversation with the model. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Options for a single completion request. */
export interface CompleteOptions {
  system?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Thin, typed wrapper over the Anthropic SDK. Centralizes model selection and
 * exposes a minimal text-completion surface for the rest of Cognix.
 */
export class CognixAI {
  private readonly client: Anthropic;
  private readonly defaultModel: string;

  constructor(options: CognixAIOptions = {}) {
    const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required to create a Cognix AI client.");
    }

    this.client = new Anthropic({ apiKey });
    this.defaultModel = options.defaultModel ?? resolveModel(process.env.COGNIX_AI_DEFAULT_MODEL);
  }

  /** Run a completion and return the concatenated text content. */
  async complete(messages: readonly ChatMessage[], options: CompleteOptions = {}): Promise<string> {
    const response = await this.client.messages.create({
      model: options.model ?? this.defaultModel ?? DEFAULT_MODEL,
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 1,
      ...(options.system !== undefined ? { system: options.system } : {}),
      messages: messages.map((message) => ({ role: message.role, content: message.content })),
    });

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  }
}
