import type { Id, Nullable, Timestamped } from "./common.js";
import type { OrganizationId } from "./organization.js";
import type { UserId } from "./user.js";

export type ProjectId = Id<"Project">;

export type ProjectStatus = "active" | "archived";

export interface Project extends Timestamped {
  readonly id: ProjectId;
  readonly organizationId: OrganizationId;
  name: string;
  description: Nullable<string>;
  status: ProjectStatus;
  readonly createdBy: UserId;
}
