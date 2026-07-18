import type { Id, Nullable, Timestamped } from "./common.js";
import type { OrganizationId } from "./organization.js";
import type { ProjectId } from "./project.js";
import type { UserId } from "./user.js";

export type DocumentId = Id<"Document">;

export interface Document extends Timestamped {
  readonly id: DocumentId;
  readonly organizationId: OrganizationId;
  projectId: Nullable<ProjectId>;
  title: string;
  /** Rich-text content serialized as portable JSON. */
  content: string;
  readonly createdBy: UserId;
}
