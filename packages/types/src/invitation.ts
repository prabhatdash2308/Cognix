import type { Id, ISODateString, Timestamped } from "./common.js";
import type { OrganizationId } from "./organization.js";
import type { WorkspaceId } from "./workspace.js";

export type InvitationId = Id<"Invitation">;

export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired" | "cancelled";

export interface Invitation extends Timestamped {
  readonly id: InvitationId;
  readonly organizationId: OrganizationId;
  readonly workspaceId: WorkspaceId | null;
  email: string;
  status: InvitationStatus;
  expiresAt: ISODateString;
}
