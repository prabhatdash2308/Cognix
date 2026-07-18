
import { cn } from "../../utils/cn.js";
import type { BadgeProps, BadgeSize, BadgeVariant } from "./Badge.types.js";

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  default: {
    badge: "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
    dot: "bg-[var(--color-neutral-500)]",
  },
  brand: {
    badge: "bg-[var(--color-accent-subtle)] text-[var(--color-brand-300)] border border-[oklch(0.627_0.200_275_/_0.25)]",
    dot: "bg-[var(--color-accent)]",
  },
  success: {
    badge: "bg-[oklch(0.648_0.158_145_/_0.12)] text-[var(--color-success-light)] border border-[oklch(0.648_0.158_145_/_0.25)]",
    dot: "bg-[var(--color-success)]",
  },
  warning: {
    badge: "bg-[oklch(0.762_0.180_80_/_0.12)] text-[var(--color-warning-light)] border border-[oklch(0.762_0.180_80_/_0.25)]",
    dot: "bg-[var(--color-warning)]",
  },
  error: {
    badge: "bg-[oklch(0.638_0.208_20_/_0.12)] text-[var(--color-error-light)] border border-[oklch(0.638_0.208_20_/_0.25)]",
    dot: "bg-[var(--color-error)]",
  },
  info: {
    badge: "bg-[oklch(0.596_0.165_220_/_0.12)] text-[var(--color-info-light)] border border-[oklch(0.596_0.165_220_/_0.25)]",
    dot: "bg-[var(--color-info)]",
  },
  outline: {
    badge: "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-strong)]",
    dot: "bg-[var(--color-neutral-400)]",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-4  px-1.5 text-[var(--text-2xs)] gap-1",
  md: "h-5  px-2   text-[var(--text-xs)]  gap-1.5",
  lg: "h-6  px-2.5 text-[var(--text-sm)]  gap-1.5",
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

/**
 * Badge — inline status / label chip.
 *
 * @example
 * <Badge variant="success" dot>Active</Badge>
 * <Badge variant="error">Deprecated</Badge>
 */
export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const { badge, dot: dotColor } = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)]",
        "font-[var(--font-weight-medium)] whitespace-nowrap",
        "select-none",
        sizeStyles[size],
        badge,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "shrink-0 rounded-[var(--radius-full)]",
            dotSizeStyles[size],
            dotColor
          )}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

Badge.displayName = "Badge";
