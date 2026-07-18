import type { Id, Nullable, Timestamped } from "./common.js";
import type { OrganizationId } from "./organization.js";
import type { UserId } from "./user.js";

export type WorkspaceId = Id<"Workspace">;
export type WorkspaceMemberId = Id<"WorkspaceMember">;

export interface Workspace extends Timestamped {
  readonly id: WorkspaceId;
  readonly organizationId: OrganizationId;
  name: string;
  slug: string;
  description: Nullable<string>;
}

export interface WorkspaceMember extends Timestamped {
  readonly id: WorkspaceMemberId;
  readonly workspaceId: WorkspaceId;
  readonly userId: UserId;
  roleId: string;
}
