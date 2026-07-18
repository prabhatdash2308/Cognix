import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";
import type { Workspace, WorkspaceMember } from "@cognix/types";

function getClient() {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return createAuthClient(token);
}

export function useWorkspace(workspaceId: string) {
  return useQuery<Workspace>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getClient().workspaces.get(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery<WorkspaceMember[]>({
    queryKey: ["workspace", workspaceId, "members"],
    queryFn: () => getClient().workspaces.members(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: { name?: string; description?: string };
    }) => getClient().workspaces.update(workspaceId, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData(["workspace", updatedWorkspace.id], updatedWorkspace);
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) => getClient().workspaces.delete(workspaceId),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ["workspace", deletedId] });
      // Would also need to invalidate workspaces list query if one existed here
    },
  });
}
