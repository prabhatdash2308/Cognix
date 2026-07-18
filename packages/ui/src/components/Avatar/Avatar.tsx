/**
 * Avatar — user profile picture with initials fallback and status indicator.
 *
 * Built on Radix UI Avatar for reliable image loading state management.
 * The image gracefully falls back to initials or a generic icon if it
 * fails to load.
 *
 * @example – image avatar
 * <Avatar
 *   src="/avatars/alice.jpg"
 *   name="Alice Johnson"
 *   size="lg"
 * />
 *
 * @example – initials fallback
 * <Avatar name="Bob Smith" size="md" />
 *
 * @example – with online status
 * <Avatar
 *   src="/avatars/carol.jpg"
 *   name="Carol White"
 *   status="online"
 * />
 *
 * @example – square (for bots / teams)
 * <Avatar name="Cognix Bot" shape="square" size="xl" />
 */
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden", {
  variants: {
    size: {
      xs: "size-6  text-[var(--text-2xs)]",
      sm: "size-8  text-[var(--text-xs)]",
      md: "size-10 text-[var(--text-sm)]",
      lg: "size-12 text-[var(--text-base)]",
      xl: "size-16 text-[var(--text-lg)]",
      "2xl": "size-20 text-[var(--text-xl)]",
    },
    shape: {
      circle: "rounded-[var(--radius-full)]",
      square: "rounded-[var(--radius-lg)]",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

const statusVariants = cva("absolute block rounded-full ring-2 ring-[var(--color-bg)]", {
  variants: {
    status: {
      online: "bg-[var(--color-success)]",
      offline: "bg-[var(--color-text-tertiary)]",
      busy: "bg-[var(--color-error)]",
      away: "bg-[var(--color-warning)]",
    },
    size: {
      xs: "size-1.5 bottom-0 right-0",
      sm: "size-2   bottom-0 right-0",
      md: "size-2.5 bottom-0.5 right-0.5",
      lg: "size-3   bottom-0.5 right-0.5",
      xl: "size-3.5 bottom-1 right-1",
      "2xl": "size-4  bottom-1 right-1",
    },
  },
});

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps
  extends VariantProps<typeof avatarVariants>, ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  /** Image URL. Falls back to initials or icon if missing or broken. */
  src?: string;
  /** Alt text for the image and source for computing initials. */
  name?: string;
  /**
   * Presence status indicator dot.
   * Accessible: adds aria-label to the status dot.
   */
  status?: AvatarStatus;
  className?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return "?";
  if (parts.length === 1) {
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

/** Deterministic pastel background from a name string */
function getColorFromName(name: string): string {
  const hues = [275, 230, 200, 145, 80, 20, 340, 170];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  const hue = hues[Math.abs(hash) % hues.length] ?? 275;
  return `oklch(0.60 0.14 ${hue})`;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Avatar = forwardRef<React.ElementRef<typeof RadixAvatar.Root>, AvatarProps>(
  ({ src, name, status, size = "md", shape = "circle", className, ...props }, ref) => {
    const initials = name ? getInitials(name) : undefined;
    const fallbackBg = name ? getColorFromName(name) : "var(--color-surface-active)";
    const statusLabel =
      status === "online"
        ? "Online"
        : status === "offline"
          ? "Offline"
          : status === "busy"
            ? "Busy"
            : status === "away"
              ? "Away"
              : undefined;

    return (
      <RadixAvatar.Root
        ref={ref}
        className={cn(avatarVariants({ size, shape }), className)}
        {...props}
      >
        {/* Image */}
        {src && (
          <RadixAvatar.Image src={src} alt={name ?? "Avatar"} className="size-full object-cover" />
        )}

        {/* Fallback: initials or generic icon */}
        <RadixAvatar.Fallback
          delayMs={src ? 200 : 0}
          className="flex size-full items-center justify-center font-[var(--font-weight-semibold)] text-white select-none"
          style={{ backgroundColor: fallbackBg }}
        >
          {initials ?? (
            /* Generic user silhouette */
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-[55%] opacity-90"
              aria-hidden
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
            </svg>
          )}
        </RadixAvatar.Fallback>

        {/* Status dot */}
        {status && (
          <span
            aria-label={statusLabel}
            role="img"
            className={cn(statusVariants({ status, size }))}
          />
        )}
      </RadixAvatar.Root>
    );
  },
);

Avatar.displayName = "Avatar";

export { avatarVariants };
export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>;
export type AvatarShape = NonNullable<VariantProps<typeof avatarVariants>["shape"]>;
