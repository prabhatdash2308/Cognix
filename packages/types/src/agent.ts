import type { Id, Nullable, Timestamped } from "./common.js";
import type { OrganizationId } from "./organization.js";

export type AgentId = Id<"Agent">;

export type AgentStatus = "draft" | "active" | "paused" | "archived";

/**
 * An autonomous AI team member configured within an organization.
 */
export interface Agent extends Timestamped {
  readonly id: AgentId;
  readonly organizationId: OrganizationId;
  name: string;
  role: string;
  /** System instructions that define the agent's behavior. */
  instructions: string;
  /** Model identifier the agent runs on (e.g. `claude-sonnet-5`). */
  model: string;
  status: AgentStatus;
  avatarUrl: Nullable<string>;
}
