/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Project, Task, Document, Activity, Notification } from "@cognix/types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1" as any,
    organizationId: "org_1" as any,
    name: "Website Redesign",
    description: "Revamp the main marketing site",
    status: "active",
    createdBy: "usr_1" as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj_2" as any,
    organizationId: "org_1" as any,
    name: "Mobile App V2",
    description: "Launch version 2 of the iOS app",
    status: "active",
    createdBy: "usr_1" as any,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task_1" as any,
    projectId: "proj_1" as any,
    title: "Design hero section",
    description: "Create high fidelity mockups for hero",
    status: "in_progress",
    priority: "high",
    assignee: { kind: "user", userId: "usr_1" as any },
    dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task_2" as any,
    projectId: "proj_2" as any,
    title: "Setup push notifications",
    description: "Configure APNS and Firebase",
    status: "todo",
    priority: "medium",
    assignee: { kind: "user", userId: "usr_2" as any },
    dueAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task_3" as any,
    projectId: "proj_1" as any,
    title: "Review copy",
    description: "Review marketing copy with team",
    status: "done",
    priority: "low",
    assignee: null,
    dueAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc_1" as any,
    organizationId: "org_1" as any,
    projectId: "proj_1" as any,
    title: "Product Requirements Q3",
    content: "# PRD\n\n...",
    createdBy: "usr_1" as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "doc_2" as any,
    organizationId: "org_1" as any,
    projectId: null,
    title: "API Specifications",
    content: "## Endpoints\n...",
    createdBy: "usr_2" as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act_1" as any,
    workspaceId: "ws_1" as any,
    type: "member_joined",
    actorId: "usr_2" as any,
    title: "Alex joined the workspace",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "act_2" as any,
    workspaceId: "ws_1" as any,
    type: "project_created",
    actorId: "usr_1" as any,
    projectId: "proj_1" as any,
    title: "Created project Website Redesign",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "act_3" as any,
    workspaceId: "ws_1" as any,
    type: "task_completed",
    actorId: "usr_1" as any,
    projectId: "proj_1" as any,
    title: "Completed task 'Review copy'",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1" as any,
    userId: "usr_1" as any,
    type: "mention",
    title: "Mentioned in comment",
    message: "Alex mentioned you in a comment on 'Design hero section'",
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "notif_2" as any,
    userId: "usr_1" as any,
    type: "assignment",
    title: "Assigned to task",
    message: "You were assigned to 'Setup push notifications'",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
