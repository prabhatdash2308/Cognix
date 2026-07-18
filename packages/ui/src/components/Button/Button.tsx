/**
 * Button — interactive trigger for actions and navigation.
 *
 * Built with CVA for type-safe variants and sizes. Supports the Radix
 * `asChild` pattern for polymorphic rendering (e.g. render as a link).
 *
 * @example – default
 * <Button>Save changes</Button>
 *
 * @example – destructive with icon
 * <Button variant="destructive" leftIcon={<TrashIcon />}>Delete</Button>
 *
 * @example – loading state
 * <Button isLoading loadingText="Saving…">Save</Button>
 *
 * @example – render as Next.js Link (asChild)
 * <Button asChild variant="ghost">
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 *
 * @example – icon-only button (always pair with aria-label)
 * <Button size="icon-sm" aria-label="Settings">
 *   <SettingsIcon />
 * </Button>
 */
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn.js";
import { focusRing } from "../../utils/focusRing.js";
import { Spinner } from "../Spinner/Spinner.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  // Base styles applied to every button regardless of variant
  [
    "relative inline-flex items-center justify-center gap-2",
    "font-[var(--font-weight-medium)] font-[var(--font-sans)]",
    "rounded-[var(--radius-lg)]",
    "border border-transparent",
    "select-none whitespace-nowrap",
    "transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
    focusRing(),
  ].join(" "),
  {
    variants: {
      variant: {
        /** Filled brand button — primary action. */
        primary: [
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
          "hover:bg-[var(--color-accent-hover)]",
          "active:bg-[var(--color-accent-active)]",
          "shadow-[var(--shadow-sm)]",
        ].join(" "),

        /** Muted background — secondary action. */
        secondary: [
          "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)]",
          "border-[var(--color-border)]",
          "hover:bg-[var(--color-surface-hover)]",
          "active:bg-[var(--color-surface-active)]",
        ].join(" "),

        /** Transparent background — tertiary / toolbar actions. */
        ghost: [
          "bg-transparent text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-surface-hover)]",
          "active:bg-[var(--color-surface-active)]",
        ].join(" "),

        /** Border-only style — secondary emphasis. */
        outline: [
          "bg-transparent text-[var(--color-text-primary)]",
          "border-[var(--color-border-strong)]",
          "hover:bg-[var(--color-surface-hover)]",
          "active:bg-[var(--color-surface-active)]",
        ].join(" "),

        /** Red-tinted — destructive / dangerous actions. */
        destructive: [
          "bg-[var(--color-error)] text-white",
          "hover:bg-[var(--color-error-dark)]",
          "active:opacity-90",
          "shadow-[var(--shadow-sm)]",
        ].join(" "),

        /** Underline-style — inline text links. */
        link: [
          "bg-transparent text-[var(--color-text-link)]",
          "underline-offset-4 hover:underline",
          "hover:text-[var(--color-text-link-hover)]",
          "h-auto! p-0! rounded-none! border-0!",
        ].join(" "),
      },
      size: {
        xs:       "h-7  px-2.5 text-[var(--text-xs)]",
        sm:       "h-8  px-3   text-[var(--text-sm)]",
        md:       "h-9  px-4   text-[var(--text-sm)]",
        lg:       "h-10 px-5   text-[var(--text-base)]",
        xl:       "h-12 px-6   text-[var(--text-base)]",
        /** Square icon-only button — pair with aria-label. */
        "icon-sm": "h-8  w-8  p-0 text-[var(--text-sm)]",
        "icon-md": "h-9  w-9  p-0 text-[var(--text-sm)]",
        "icon-lg": "h-10 w-10 p-0 text-[var(--text-base)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, renders children as a Radix Slot — merging props onto
   * the single child element. Useful for rendering Button as a link.
   * @default false
   */
  asChild?: boolean;
  /** Render a spinner and disable the button during async operations. */
  isLoading?: boolean;
  /** Text shown next to the spinner when `isLoading` is true. */
  loadingText?: string;
  /** Icon rendered to the left of the label. */
  leftIcon?: ReactNode;
  /** Icon rendered to the right of the label. */
  rightIcon?: ReactNode;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      fullWidth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled ?? isLoading;

    // Map button size to spinner size
    const spinnerSize =
      size === "xs" || size === "icon-sm"
        ? "xs"
        : size === "sm"
          ? "sm"
          : size === "lg" || size === "xl" || size === "icon-lg"
            ? "md"
            : "sm";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner
              size={spinnerSize}
              aria-hidden
              label={loadingText ?? "Loading"}
            />
            {loadingText ?? children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0" aria-hidden>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0" aria-hidden>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
