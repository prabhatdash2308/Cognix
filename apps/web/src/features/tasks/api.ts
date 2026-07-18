import type { Task, TaskCreateInput, TaskUpdateInput, TaskBulkUpdateInput } from "@cognix/types";
import { mockTasks } from "./task.mock";
// Removed unused sdk import
// Keep state local to mock API to allow updates
let localTasks = [...mockTasks];

export const tasksApi = {
  get: async (taskId: string): Promise<Task> => {
    // return sdk.tasks.get(taskId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const task = localTasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");
    return task;
  },

  listByProject: async (projectId: string): Promise<Task[]> => {
    // return sdk.tasks.listByProject(projectId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return localTasks.filter((t) => t.projectId === projectId);
  },

  create: async (data: TaskCreateInput): Promise<Task> => {
    // return sdk.tasks.create(data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTask: Task = {
      id: `task_${Math.random().toString(36).substring(7)}`,
      projectId: data.projectId,
      parentTaskId: data.parentTaskId ?? null,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      type: data.type ?? "task",
      assigneeId: data.assigneeId ?? null,
      reporterId: data.reporterId ?? null,
      assignedAgentId: data.assignedAgentId ?? null,
      dueDate: data.dueDate ?? null,
      startDate: data.startDate ?? null,
      completedAt: data.completedAt ?? null,
      estimatedHours: data.estimatedHours ?? null,
      actualHours: data.actualHours ?? null,
      position: data.position ?? 0,
      metadata: data.metadata ?? {},
      aiContext: data.aiContext ?? {},
      aiStatus: data.aiStatus ?? "idle",
      isRecurring: data.isRecurring ?? false,
      recurrenceRule: data.recurrenceRule ?? null,
      nextOccurrence: data.nextOccurrence ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: [], // mock
    };
    localTasks.push(newTask);
    return newTask;
  },

  update: async (taskId: string, data: Omit<TaskUpdateInput, "id">): Promise<Task> => {
    // return sdk.tasks.update(taskId, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const idx = localTasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error("Task not found");

    const updated = {
      ...localTasks[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    } as Task;
    localTasks[idx] = updated;
    return updated;
  },

  delete: async (taskId: string): Promise<void> => {
    // return sdk.tasks.delete(taskId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localTasks = localTasks.filter((t) => t.id !== taskId);
  },

  bulkUpdate: async (data: TaskBulkUpdateInput): Promise<Task[]> => {
    // return sdk.tasks.bulkUpdate(data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updatedTasks: Task[] = [];
    localTasks = localTasks.map((t) => {
      if (data.taskIds.includes(t.id)) {
        const updated = {
          ...t,
          ...(data.status && { status: data.status }),
          ...(data.priority && { priority: data.priority }),
          ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
          updatedAt: new Date().toISOString(),
        };
        updatedTasks.push(updated);
        return updated;
      }
      return t;
    });
    return updatedTasks;
  },
};
