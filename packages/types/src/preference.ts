import type { Id, Timestamped } from "./common.js";
import type { UserId } from "./user.js";

export type PreferenceId = Id<"Preference">;
export type Theme = "light" | "dark" | "system";

export interface UserPreference extends Timestamped {
  readonly id: PreferenceId;
  readonly userId: UserId;
  theme: Theme;
  language: string;
  timezone: string;
  dateFormat: string;
  sidebarCollapsed: boolean;
  notificationPrefs: Record<string, unknown>;
}

export interface UpdatePreferenceRequest {
  theme?: Theme;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  sidebarCollapsed?: boolean;
  notificationPrefs?: Record<string, unknown>;
}
