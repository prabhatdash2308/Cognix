import { useMutation } from "@tanstack/react-query";
import { createAuthClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";

function getClient() {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return createAuthClient(token);
}

export function useInviteUser() {
  return useMutation({
    mutationFn: ({
      orgId,
      email,
      role_name,
      workspace_id,
    }: {
      orgId: string;
      email: string;
      role_name?: string;
      workspace_id?: string;
    }) =>
      getClient().invitations.invite(orgId, {
        email,
        ...(role_name ? { role_name } : {}),
        ...(workspace_id ? { workspace_id } : {}),
      }),
  });
}

export function useRejectInvitation() {
  return useMutation({
    mutationFn: (invitationId: string) => getClient().invitations.reject(invitationId),
  });
}

export function useResendInvitation() {
  return useMutation({
    mutationFn: (invitationId: string) => getClient().invitations.resend(invitationId),
  });
}
