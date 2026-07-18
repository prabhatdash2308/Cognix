export type TaskStatus = "todo" | "in_progress" | "in_review" | "blocked" | "done" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskType = "task" | "bug" | "feature" | "epic" | "story" | "subtask";

export type AIStatus = "idle" | "planning" | "running" | "waiting" | "failed" | "completed";

export interface Label {
  id: string;
  projectId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
}

export interface TaskWatcher {
  id: string;
  taskId: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;

  assigneeId: string | null;
  reporterId: string | null;
  assignedAgentId: string | null;

  dueDate: string | null;
  startDate: string | null;
  completedAt: string | null;

  estimatedHours: number | null;
  actualHours: number | null;
  position: number;

  metadata: Record<string, unknown> | null;
  aiContext: Record<string, unknown> | null;
  aiStatus: AIStatus;

  isRecurring: boolean;
  recurrenceRule: string | null;
  nextOccurrence: string | null;

  createdAt: string;
  updatedAt: string;

  labels?: Label[];
}

export interface TaskCreateInput {
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;

  assigneeId?: string | null;
  reporterId?: string | null;
  assignedAgentId?: string | null;

  dueDate?: string | null;
  startDate?: string | null;
  completedAt?: string | null;

  estimatedHours?: number | null;
  actualHours?: number | null;
  position?: number;

  metadata?: Record<string, unknown> | null;
  aiContext?: Record<string, unknown> | null;
  aiStatus?: AIStatus;

  isRecurring?: boolean;
  recurrenceRule?: string | null;
  nextOccurrence?: string | null;

  labelIds?: string[];
}

export interface TaskUpdateInput extends Partial<Omit<TaskCreateInput, "projectId">> {
  id: string;
}

export interface TaskBulkUpdateInput {
  taskIds: string[];
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  labelIds?: string[];
}
