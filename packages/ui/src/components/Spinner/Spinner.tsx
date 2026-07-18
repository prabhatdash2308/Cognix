/**
 * Spinner — animated loading indicator.
 *
 * CSS-based, inherits `currentColor`, adapts to any parent text color.
 * Use inside Button's `isLoading` state, or standalone for page-level loading.
 *
 * @example
 * <Spinner size="md" />
 *
 * @example – colored
 * <Spinner size="sm" className="text-[var(--color-accent)]" />
 */
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const spinnerVariants = cva(
  "inline-block shrink-0 rounded-[var(--radius-full)] border-solid border-current border-r-transparent animate-[cx-spin_0.75s_linear_infinite]",
  {
    variants: {
      size: {
        xs: "size-3 border-2",
        sm: "size-4 border-2",
        md: "size-5 border-2",
        lg: "size-6 border-[3px]",
        xl: "size-8 border-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible label for screen readers. @default "Loading" */
  label?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size, label = "Loading", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export { spinnerVariants };
export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>["size"]>;
