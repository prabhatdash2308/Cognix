/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Project, Task, Document, Activity, Notification } from "@cognix/types";
import {
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_DOCUMENTS,
  MOCK_ACTIVITIES,
  MOCK_NOTIFICATIONS,
} from "./dashboard.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  getRecentProjects: async (_workspaceId: string): Promise<Project[]> => {
    await delay(600); // Simulate network latency
    return MOCK_PROJECTS;
  },

  getRecentTasks: async (_workspaceId: string): Promise<Task[]> => {
    await delay(700);
    return MOCK_TASKS;
  },

  getRecentDocuments: async (_workspaceId: string): Promise<Document[]> => {
    await delay(500);
    return MOCK_DOCUMENTS;
  },

  getRecentActivity: async (_workspaceId: string): Promise<Activity[]> => {
    await delay(800);
    return MOCK_ACTIVITIES;
  },

  getNotifications: async (): Promise<Notification[]> => {
    await delay(400);
    return MOCK_NOTIFICATIONS;
  },
};
