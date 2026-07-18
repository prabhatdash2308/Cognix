
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "../../utils/cn.js";
import type { AvatarProps, AvatarSize, AvatarStatus } from "./Avatar.types.js";

/* ─── Sizes ─────────────────────────────────────────────────────────────── */
const sizeStyles: Record<AvatarSize, { root: string; text: string; status: string }> = {
  xs:  { root: "h-6 w-6",   text: "text-[9px]",                    status: "h-1.5 w-1.5 bottom-0 right-0" },
  sm:  { root: "h-8 w-8",   text: "text-[var(--text-2xs)]",        status: "h-2 w-2 bottom-0 right-0" },
  md:  { root: "h-9 w-9",   text: "text-[var(--text-xs)]",         status: "h-2.5 w-2.5 bottom-0 right-0" },
  lg:  { root: "h-11 w-11", text: "text-[var(--text-sm)]",         status: "h-3 w-3 bottom-0.5 right-0.5" },
  xl:  { root: "h-14 w-14", text: "text-[var(--text-base)]",       status: "h-3.5 w-3.5 bottom-0.5 right-0.5" },
  "2xl": { root: "h-20 w-20", text: "text-[var(--text-xl)]",       status: "h-4 w-4 bottom-1 right-1" },
};

/* ─── Status colors ─────────────────────────────────────────────────────── */
const statusColors: Record<AvatarStatus, string> = {
  online:  "bg-[var(--color-success)]",
  offline: "bg-[var(--color-neutral-500)]",
  busy:    "bg-[var(--color-error)]",
  away:    "bg-[var(--color-warning)]",
};

/* ─── Fallback color palette (deterministic per initials) ────────────────  */
const FALLBACK_COLORS = [
  "bg-[oklch(0.456_0.195_275)] text-[var(--color-neutral-0)]",  // indigo
  "bg-[oklch(0.456_0.195_310)] text-[var(--color-neutral-0)]",  // purple
  "bg-[oklch(0.456_0.195_200)] text-[var(--color-neutral-0)]",  // teal
  "bg-[oklch(0.456_0.195_160)] text-[var(--color-neutral-0)]",  // green
  "bg-[oklch(0.456_0.195_40)]  text-[var(--color-neutral-0)]",  // orange
  "bg-[oklch(0.456_0.195_20)]  text-[var(--color-neutral-0)]",  // red
  "bg-[oklch(0.456_0.195_240)] text-[var(--color-neutral-0)]",  // sky
];

function getInitials(alt = "", fallback?: string): string {
  if (fallback) return fallback.slice(0, 2).toUpperCase();
  const parts = alt.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (
      (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
    ).toUpperCase();
  }
  return alt.slice(0, 2).toUpperCase();
}

function pickColor(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return FALLBACK_COLORS[code % FALLBACK_COLORS.length] ?? FALLBACK_COLORS[0] ?? "";
}

/**
 * Avatar — user image with fallback initials, size variants, and status dot.
 *
 * @example
 * <Avatar src="/user.jpg" alt="Alice Smith" size="md" status="online" />
 * <Avatar alt="Bob Jones" size="lg" />
 */
export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  shape = "circle",
  status,
  className,
  ...props
}: AvatarProps) {
  const initials = getInitials(alt, fallback);
  const fallbackColor = pickColor(initials);
  const { root, text, status: statusStyle } = sizeStyles[size];
  const shapeClass =
    shape === "circle"
      ? "rounded-[var(--radius-full)]"
      : "rounded-[var(--radius-lg)]";

  return (
    <div className="relative inline-flex shrink-0">
      <RadixAvatar.Root
        className={cn(
          "relative flex shrink-0 overflow-hidden",
          "select-none",
          root,
          shapeClass,
          className
        )}
        {...props}
      >
        <RadixAvatar.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <RadixAvatar.Fallback
          delayMs={300}
          className={cn(
            "flex h-full w-full items-center justify-center",
            "font-[var(--font-weight-semibold)]",
            text,
            fallbackColor
          )}
        >
          {initials}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>

      {/* Status dot */}
      {status && (
        <span
          aria-label={status}
          className={cn(
            "absolute block rounded-[var(--radius-full)]",
            "ring-2 ring-[var(--color-bg-base)]",
            statusStyle,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

Avatar.displayName = "Avatar";
