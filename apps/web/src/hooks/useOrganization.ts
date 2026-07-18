import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";
import type { Organization, Membership } from "@cognix/types";

function getClient() {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return createAuthClient(token);
}

export function useOrganization(orgId: string) {
  return useQuery<Organization>({
    queryKey: ["organization", orgId],
    queryFn: () => getClient().organizations.get(orgId),
    enabled: !!orgId,
  });
}

export function useOrganizationMembers(orgId: string) {
  return useQuery<Membership[]>({
    queryKey: ["organization", orgId, "members"],
    queryFn: () => getClient().organizations.members(orgId),
    enabled: !!orgId,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: { name?: string; slug?: string; logo_url?: string } }) =>
      getClient().organizations.update(orgId, data),
    onSuccess: (updatedOrg) => {
      queryClient.setQueryData(["organization", updatedOrg.id], updatedOrg);
    },
  });
}

export function useRemoveOrganizationMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: string; userId: string }) =>
      getClient().organizations.removeMember(orgId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization", variables.orgId, "members"] });
    },
  });
}
