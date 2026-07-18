import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard.api";

export function useRecentProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", "recent", workspaceId],
    queryFn: () => dashboardApi.getRecentProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useRecentTasks(workspaceId: string) {
  return useQuery({
    queryKey: ["tasks", "recent", workspaceId],
    queryFn: () => dashboardApi.getRecentTasks(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useRecentDocuments(workspaceId: string) {
  return useQuery({
    queryKey: ["documents", "recent", workspaceId],
    queryFn: () => dashboardApi.getRecentDocuments(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useRecentActivity(workspaceId: string) {
  return useQuery({
    queryKey: ["activity", "recent", workspaceId],
    queryFn: () => dashboardApi.getRecentActivity(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => dashboardApi.getNotifications(),
  });
}
