import type { Id, Nullable, Timestamped } from "./common.js";

export type UserId = Id<"User">;

export type UserStatus = "active" | "invited" | "suspended";

export interface User extends Timestamped {
  readonly id: UserId;
  email: string;
  name: string;
  avatarUrl: Nullable<string>;
  status: UserStatus;
}
