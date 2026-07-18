
import { cn } from "../../utils/cn.js";
import type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardVariant,
} from "./Card.types.js";

const variantStyles: Record<CardVariant, string> = {
  default: [
    "bg-[var(--color-surface)]",
    "border border-[var(--color-border)]",
    "shadow-[var(--shadow-sm)]",
  ].join(" "),

  elevated: [
    "bg-[var(--color-surface-raised)]",
    "border border-[var(--color-border)]",
    "shadow-[var(--shadow-md)]",
  ].join(" "),

  outline: [
    "bg-transparent",
    "border border-[var(--color-border-strong)]",
  ].join(" "),

  ghost: [
    "bg-transparent",
    "border border-transparent",
  ].join(" "),
};

/**
 * Card — surface container with optional header, body, and footer slots.
 *
 * @example
 * <Card variant="elevated">
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content here</CardBody>
 *   <CardFooter><Button>Action</Button></CardFooter>
 * </Card>
 */
export function Card({
  variant = "default",
  noPadding = false,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] overflow-hidden",
        variantStyles[variant],
        !noPadding && "p-5",
        interactive && [
          "cursor-pointer",
          "transition-[transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]",
          "active:translate-y-0 active:shadow-[var(--shadow-sm)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
Card.displayName = "Card";

/**
 * CardHeader — top section of Card, typically for titles and actions.
 */
export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        "pb-4 border-b border-[var(--color-border)]",
        "mb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
CardHeader.displayName = "CardHeader";

/**
 * CardBody — main content area of Card.
 */
export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
}
CardBody.displayName = "CardBody";

/**
 * CardFooter — bottom section of Card, typically for actions.
 */
export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3",
        "pt-4 border-t border-[var(--color-border)]",
        "mt-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
CardFooter.displayName = "CardFooter";
