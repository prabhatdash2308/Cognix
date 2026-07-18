import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectVisibility } from "@cognix/types";
import * as api from "./api";

// ── Query Keys ───────────────────────────────────────────────────────────────

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  members: (id: string) => [...projectKeys.detail(id), "members"] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useWorkspaceProjects(workspaceId: string) {
  return useQuery({
    queryKey: projectKeys.list(workspaceId),
    queryFn: () => api.getWorkspaceProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId,
  });
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => api.getProjectMembers(projectId),
    enabled: !!projectId,
  });
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      workspaceId: string;
      name: string;
      description?: string;
      emoji?: string;
      color?: string;
      visibility?: ProjectVisibility;
    }) => api.createProject(data.workspaceId, data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list(project.workspaceId) });
      queryClient.setQueryData(projectKeys.detail(project.id), project);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      emoji?: string;
      color?: string;
      visibility?: ProjectVisibility;
    }) => api.updateProject(id, data),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => api.archiveProject(projectId),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => api.deleteProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
