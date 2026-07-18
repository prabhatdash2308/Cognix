import type { Id, Nullable, Timestamped } from "./common.js";
import type { WorkspaceId } from "./workspace.js";
import type { UserId, User } from "./user.js";

export type ProjectId = Id<"Project">;
export type ProjectMemberId = Id<"ProjectMember">;

export type ProjectStatus = "active" | "archived" | "completed" | "on_hold";
export type ProjectVisibility = "private" | "team" | "public";
export type ProjectRole = "owner" | "admin" | "editor" | "viewer";

export interface Project extends Timestamped {
  readonly id: ProjectId;
  readonly workspaceId: WorkspaceId;
  name: string;
  slug: string;
  description: Nullable<string>;
  emoji: Nullable<string>;
  color: Nullable<string>;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  readonly ownerId: UserId;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  archivedAt: Nullable<string>; // ISO date string
}

export interface ProjectMember {
  readonly id: ProjectMemberId;
  readonly projectId: ProjectId;
  readonly userId: UserId;
  role: ProjectRole;
  joinedAt: string; // ISO date string
  user?: User; // joined relation
}
