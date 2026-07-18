import type { Id, Timestamped } from "./common.js";
import type { UserId } from "./user.js";

export type OrganizationId = Id<"Organization">;
export type MembershipId = Id<"Membership">;

export interface Organization extends Timestamped {
  readonly id: OrganizationId;
  name: string;
  slug: string;
}

/** Role of a user within an organization. Ordered from least to most privileged. */
export type MembershipRole = "guest" | "member" | "admin" | "owner";

export interface Membership extends Timestamped {
  readonly id: MembershipId;
  readonly organizationId: OrganizationId;
  readonly userId: UserId;
  role: MembershipRole;
}
