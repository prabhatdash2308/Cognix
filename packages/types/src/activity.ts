import type { Id, Timestamped } from "./common.js";
import type { UserId } from "./user.js";
import type { WorkspaceId } from "./workspace.js";
import type { ProjectId } from "./project.js";

export type ActivityId = Id<"Activity">;

export type ActivityType =
  "member_joined" | "project_created" | "task_completed" | "document_uploaded";

export interface Activity extends Timestamped {
  readonly id: ActivityId;
  readonly workspaceId: WorkspaceId;
  readonly type: ActivityType;
  readonly actorId: UserId; // Person who did the action
  readonly projectId?: ProjectId; // If related to a project
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
