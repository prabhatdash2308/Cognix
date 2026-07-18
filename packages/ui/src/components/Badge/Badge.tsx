/**
 * Badge — compact label for status, counts, or categories.
 *
 * Use to tag items with a status, label a feature as new/beta,
 * or display notification counts.
 *
 * @example – status badge
 * <Badge variant="success">Active</Badge>
 *
 * @example – with dot indicator
 * <Badge variant="warning" dot>Degraded</Badge>
 *
 * @example – numeric count
 * <Badge variant="primary" size="sm">12</Badge>
 *
 * @example – outline style
 * <Badge variant="outline">Beta</Badge>
 */
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  // Base
  [
    "inline-flex items-center gap-1.5",
    "font-[var(--font-weight-medium)] font-[var(--font-sans)]",
    "rounded-[var(--radius-full)]",
    "whitespace-nowrap select-none",
    "border",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default neutral grey badge. */
        default: [
          "bg-[var(--color-surface-raised)]",
          "text-[var(--color-text-secondary)]",
          "border-[var(--color-border)]",
        ].join(" "),

        /** Brand-colored badge — new features, highlights. */
        primary: [
          "bg-[var(--color-accent-subtle)]",
          "text-[var(--color-accent)]",
          "border-transparent",
        ].join(" "),

        /** Green — active, completed, healthy. */
        success: [
          "bg-[var(--color-success-light)]/20",
          "text-[var(--color-success-dark)]",
          "border-transparent",
          "[data-theme=dark]:bg-[var(--color-success)]/15",
          "[data-theme=dark]:text-[var(--color-success-light)]",
        ].join(" "),

        /** Amber — warning, degraded, pending review. */
        warning: [
          "bg-[var(--color-warning-light)]/20",
          "text-[var(--color-warning-dark)]",
          "border-transparent",
          "[data-theme=dark]:bg-[var(--color-warning)]/15",
          "[data-theme=dark]:text-[var(--color-warning-light)]",
        ].join(" "),

        /** Red — error, failed, critical. */
        error: [
          "bg-[var(--color-error-light)]/20",
          "text-[var(--color-error-dark)]",
          "border-transparent",
          "[data-theme=dark]:bg-[var(--color-error)]/15",
          "[data-theme=dark]:text-[var(--color-error-light)]",
        ].join(" "),

        /** Blue — informational, tips. */
        info: [
          "bg-[var(--color-info-light)]/20",
          "text-[var(--color-info-dark)]",
          "border-transparent",
          "[data-theme=dark]:bg-[var(--color-info)]/15",
          "[data-theme=dark]:text-[var(--color-info-light)]",
        ].join(" "),

        /** Border-only, transparent background. */
        outline: [
          "bg-transparent",
          "text-[var(--color-text-secondary)]",
          "border-[var(--color-border-strong)]",
        ].join(" "),
      },
      size: {
        sm: "px-2   py-0.5 text-[var(--text-2xs)]",
        md: "px-2.5 py-1   text-[var(--text-xs)]",
        lg: "px-3   py-1   text-[var(--text-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/* ─── Dot variants ───────────────────────────────────────────────────────── */

const dotVariants: Record<NonNullable<VariantProps<typeof badgeVariants>["variant"]>, string> = {
  default: "bg-[var(--color-text-tertiary)]",
  primary: "bg-[var(--color-accent)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  info: "bg-[var(--color-info)]",
  outline: "bg-[var(--color-text-tertiary)]",
};

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Render a colored dot indicator before the label. @default false */
  dot?: boolean;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size, dot = false, className, children, ...props }, ref) => {
    const resolvedVariant = variant ?? "default";

    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {dot && (
          <span
            aria-hidden
            className={cn(
              "inline-block rounded-full shrink-0",
              size === "lg" ? "size-2" : "size-1.5",
              dotVariants[resolvedVariant],
            )}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { badgeVariants };
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;
