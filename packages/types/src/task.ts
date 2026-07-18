import type { Id, ISODateString, Nullable, Timestamped } from "./common.js";
import type { AgentId } from "./agent.js";
import type { ProjectId } from "./project.js";
import type { UserId } from "./user.js";

export type TaskId = Id<"Task">;

export type TaskStatus = "backlog" | "todo" | "in_progress" | "blocked" | "done" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

/** A task may be owned by a human or an autonomous agent. */
export type TaskAssignee =
  | { readonly kind: "user"; readonly userId: UserId }
  | { readonly kind: "agent"; readonly agentId: AgentId };

export interface Task extends Timestamped {
  readonly id: TaskId;
  readonly projectId: ProjectId;
  title: string;
  description: Nullable<string>;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Nullable<TaskAssignee>;
  dueAt: Nullable<ISODateString>;
}
