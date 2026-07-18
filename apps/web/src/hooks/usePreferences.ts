import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";
import type { UserPreference, UpdatePreferenceRequest } from "@cognix/types";

function getClient() {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");
  return createAuthClient(token);
}

export function usePreferences() {
  return useQuery<UserPreference>({
    queryKey: ["preferences", "me"],
    queryFn: () => getClient().preferences.get(),
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePreferenceRequest) => getClient().preferences.update(data),
    onSuccess: (updatedPrefs) => {
      queryClient.setQueryData(["preferences", "me"], updatedPrefs);
    },
  });
}
