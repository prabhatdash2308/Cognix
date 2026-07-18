import { forwardRef } from "react";
import { cn } from "../../utils/cn.js";
import { Spinner } from "../Spinner/Spinner.js";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types.js";

/* ─── Variant styles ────────────────────────────────────────────────────── */

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
    "border border-transparent",
    "hover:bg-[var(--color-accent-hover)]",
    "active:bg-[var(--color-accent-active)]",
    "shadow-[var(--shadow-sm)]",
    "hover:shadow-[var(--shadow-glow-sm)]",
  ].join(" "),

  secondary: [
    "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
    "border border-[var(--color-border)]",
    "hover:bg-[var(--color-surface-hover)]",
    "hover:border-[var(--color-border-strong)]",
    "active:bg-[var(--color-surface-active)]",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "border border-transparent",
    "hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]",
    "active:bg-[var(--color-surface-hover)]",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--color-accent)]",
    "border border-[var(--color-border-focus)]",
    "hover:bg-[var(--color-accent-subtle)]",
    "active:bg-[var(--color-accent-subtle)]",
  ].join(" "),

  destructive: [
    "bg-[var(--color-error)] text-white",
    "border border-transparent",
    "hover:bg-[var(--color-error-dark)]",
    "active:opacity-90",
    "shadow-[var(--shadow-sm)]",
  ].join(" "),

  link: [
    "bg-transparent text-[var(--color-text-link)]",
    "border border-transparent",
    "hover:text-[var(--color-text-link-hover)] underline underline-offset-4",
    "active:opacity-80",
    "p-0 h-auto",
  ].join(" "),
};

/* ─── Size styles ───────────────────────────────────────────────────────── */

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-6  px-2   text-[var(--text-2xs)] gap-1   rounded-[var(--radius-sm)]",
  sm: "h-8  px-3   text-[var(--text-xs)]  gap-1.5 rounded-[var(--radius-md)]",
  md: "h-9  px-4   text-[var(--text-sm)]  gap-2   rounded-[var(--radius-md)]",
  lg: "h-10 px-5   text-[var(--text-base)] gap-2  rounded-[var(--radius-lg)]",
  xl: "h-12 px-6   text-[var(--text-lg)]  gap-2.5 rounded-[var(--radius-lg)]",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  xs: "h-6  w-6",
  sm: "h-8  w-8",
  md: "h-9  w-9",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

/* ─── Component ─────────────────────────────────────────────────────────── */

/**
 * Button — primary interactive control.
 *
 * @example
 * <Button variant="primary" size="md">Save changes</Button>
 * <Button variant="secondary" loading>Processing…</Button>
 * <Button variant="destructive" iconStart={<TrashIcon />}>Delete</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      iconStart,
      iconEnd,
      iconOnly = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center",
          "font-[var(--font-weight-medium)] whitespace-nowrap",
          "select-none cursor-pointer",
          "transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-border-focus)]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-40",
          // Variant
          variantStyles[variant],
          // Size
          iconOnly
            ? [
                "p-0",
                iconOnlySizeStyles[size],
                `rounded-[var(--radius-${size === "xs" || size === "sm" ? "sm" : "md"})]`,
              ]
            : sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Spinner
              size={size === "lg" || size === "xl" ? "sm" : "xs"}
              className="text-current"
            />
            {!iconOnly && (
              <span className="ml-2">{children}</span>
            )}
          </>
        ) : (
          <>
            {iconStart && (
              <span className="shrink-0" aria-hidden>
                {iconStart}
              </span>
            )}
            {!iconOnly && children}
            {iconEnd && (
              <span className="shrink-0" aria-hidden>
                {iconEnd}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
