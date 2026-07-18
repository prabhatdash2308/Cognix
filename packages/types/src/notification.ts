import type { Id, Timestamped } from "./common.js";
import type { UserId } from "./user.js";

export type NotificationId = Id<"Notification">;

export type NotificationType = "mention" | "assignment" | "system" | "alert";

export interface Notification extends Timestamped {
  readonly id: NotificationId;
  readonly userId: UserId;
  readonly type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
}
