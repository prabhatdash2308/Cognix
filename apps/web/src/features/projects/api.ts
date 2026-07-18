import type { Project, ProjectMember, ProjectRole, ProjectVisibility } from "@cognix/types";
import { createAuthClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";

function getClient() {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return createAuthClient(token);
}

export async function createProject(
  workspaceId: string,
  data: {
    name: string;
    description?: string;
    emoji?: string;
    color?: string;
    visibility?: ProjectVisibility;
  },
): Promise<Project> {
  return getClient().projects.create(workspaceId, data);
}

export async function getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
  return getClient().workspaces.projects(workspaceId);
}

export async function getProject(projectId: string): Promise<Project> {
  return getClient().projects.get(projectId);
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    emoji?: string;
    color?: string;
    visibility?: ProjectVisibility;
  },
): Promise<Project> {
  return getClient().projects.update(projectId, data);
}

export async function deleteProject(projectId: string): Promise<void> {
  return getClient().projects.delete(projectId);
}

export async function archiveProject(projectId: string): Promise<Project> {
  return getClient().projects.archive(projectId);
}

export async function restoreProject(projectId: string): Promise<Project> {
  return getClient().projects.restore(projectId);
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  return getClient().projects.members(projectId);
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: ProjectRole,
): Promise<ProjectMember> {
  return getClient().projects.addMember(projectId, userId, role);
}

export async function removeProjectMember(projectId: string, userId: string): Promise<void> {
  return getClient().projects.removeMember(projectId, userId);
}
