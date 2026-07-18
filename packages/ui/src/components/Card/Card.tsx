/**
 * Card — surface container for grouping related content.
 *
 * Compound component: `Card`, `CardHeader`, `CardBody`, `CardFooter`.
 * Use parts individually or combine them for structured layouts.
 *
 * @example – basic usage
 * <Card>
 *   <CardHeader title="Usage" description="Your API usage this month." />
 *   <CardBody>
 *     <ProgressBar value={72} />
 *   </CardBody>
 *   <CardFooter>
 *     <Button size="sm">Upgrade plan</Button>
 *   </CardFooter>
 * </Card>
 *
 * @example – interactive (clickable) card
 * <Card interactive onClick={handleClick}>
 *   <CardBody>Click me</CardBody>
 * </Card>
 *
 * @example – ghost (no background) card
 * <Card variant="ghost">
 *   <CardBody>Minimal container</CardBody>
 * </Card>
 */
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn.js";
import { focusRing } from "../../utils/focusRing.js";

/* ─── Card root variants ─────────────────────────────────────────────────── */

const cardVariants = cva(
  [
    "rounded-[var(--radius-xl)]",
    "transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default bordered card with surface background. */
        default: [
          "bg-[var(--color-surface)]",
          "border border-[var(--color-border)]",
          "shadow-[var(--shadow-sm)]",
        ].join(" "),

        /** Slightly elevated card — use to layer above the default surface. */
        elevated: [
          "bg-[var(--color-surface-raised)]",
          "border border-[var(--color-border)]",
          "shadow-[var(--shadow-md)]",
        ].join(" "),

        /** Border-only, transparent background. */
        outline: ["bg-transparent", "border border-[var(--color-border-strong)]"].join(" "),

        /** No border, no background — layout container only. */
        ghost: "bg-transparent",
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:border-[var(--color-border-strong)]",
          "hover:shadow-[var(--shadow-md)]",
          "hover:-translate-y-px",
          "active:translate-y-0 active:shadow-[var(--shadow-sm)]",
          focusRing(),
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  },
);

/* ─── Card sub-component variants ───────────────────────────────────────── */

const cardHeaderVariants = cva("px-6 py-4 flex flex-col gap-1", {
  variants: {
    divided: {
      true: "border-b border-[var(--color-border)]",
      false: "",
    },
  },
  defaultVariants: { divided: false },
});

const cardFooterVariants = cva("px-6 py-4 flex items-center gap-3", {
  variants: {
    divided: {
      true: "border-t border-[var(--color-border)]",
      false: "",
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
      center: "justify-center",
    },
  },
  defaultVariants: {
    divided: true,
    justify: "end",
  },
});

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardHeaderVariants> {}

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal + vertical padding preset. @default true */
  padded?: boolean;
}

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFooterVariants> {}

/* ─── Components ─────────────────────────────────────────────────────────── */

/**
 * Card — the root surface container.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, interactive, className, ...props }, ref) => (
    <div
      ref={ref}
      tabIndex={interactive ? 0 : undefined}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/**
 * CardHeader — flex container for the top area of the card.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ divided, className, ...props }, ref) => (
    <div ref={ref} className={cn(cardHeaderVariants({ divided }), className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle — bold title text for the card header.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-[var(--text-base)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] leading-snug",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription — muted description text below the title.
 */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-[var(--text-sm)] text-[var(--color-text-secondary)] leading-normal",
        className,
      )}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

/**
 * CardContent — main content area with default padding.
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ padded = true, className, ...props }, ref) => (
    <div ref={ref} className={cn(padded && "px-6 py-4", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

/**
 * CardFooter — action area at the bottom of a card, divided by default.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divided, justify, className, ...props }, ref) => (
    <div ref={ref} className={cn(cardFooterVariants({ divided, justify }), className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { cardVariants };
export type CardVariant = NonNullable<VariantProps<typeof cardVariants>["variant"]>;
