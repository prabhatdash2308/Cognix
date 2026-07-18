import type { Id, Nullable, Timestamped } from "./common.js";
import type { AgentId } from "./agent.js";
import type { OrganizationId } from "./organization.js";
import type { ProjectId } from "./project.js";

export type MemoryId = Id<"Memory">;

/** Scope that a memory entry is visible to. */
export type MemoryScope = "organization" | "project" | "agent";

/**
 * A unit of shared knowledge in the organization's memory graph.
 */
export interface MemoryEntry extends Timestamped {
  readonly id: MemoryId;
  readonly organizationId: OrganizationId;
  scope: MemoryScope;
  /** Set when `scope` is `project`. */
  projectId: Nullable<ProjectId>;
  /** Set when `scope` is `agent`. */
  agentId: Nullable<AgentId>;
  title: string;
  content: string;
  tags: readonly string[];
}
