import type { ComponentPropsWithoutRef } from "react";
import type * as RadixAvatar from "@radix-ui/react-avatar";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  /** Image src URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback initials (max 2 chars, auto-extracted from alt if omitted) */
  fallback?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Shape */
  shape?: AvatarShape;
  /** Optional presence status dot */
  status?: AvatarStatus;
}
