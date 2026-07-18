/**
 * Input — single-line text field with label, helper text, and adornments.
 *
 * Supports error/success states, start/end icons, clear button,
 * and all native input attributes via forwardRef.
 */
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useId, useRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn.js";
import { focusRing } from "../../utils/focusRing.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const inputWrapperVariants = cva(
  [
    "flex items-center",
    "rounded-[var(--radius-lg)]",
    "border",
    "bg-[var(--color-surface)]",
    "transition-colors duration-[var(--duration-fast)]",
    "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      state: {
        default: [
          "border-[var(--color-border)]",
          "hover:border-[var(--color-border-strong)]",
          "has-[:focus-visible]:border-[var(--color-border-focus)]",
          "has-[:focus-visible]:shadow-[var(--shadow-focus)]",
        ].join(" "),
        error: [
          "border-[var(--color-error)]",
          "has-[:focus-visible]:border-[var(--color-error)]",
          "has-[:focus-visible]:shadow-[0_0_0_3px_var(--color-error-light)]",
        ].join(" "),
        success: [
          "border-[var(--color-success)]",
          "has-[:focus-visible]:border-[var(--color-success)]",
          "has-[:focus-visible]:shadow-[0_0_0_3px_var(--color-success-light)]",
        ].join(" "),
      },
      size: {
        sm: "h-8  text-[var(--text-xs)]",
        md: "h-9  text-[var(--text-sm)]",
        lg: "h-11 text-[var(--text-base)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      fullWidth: true,
    },
  },
);

const inputElementClasses = [
  "flex-1 min-w-0 bg-transparent",
  "text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-tertiary)]",
  "outline-none border-0 ring-0",
  "disabled:cursor-not-allowed",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text-primary)]",
  "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out]",
].join(" ");

const adornmentClasses = "shrink-0 flex items-center text-[var(--color-text-tertiary)]";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputWrapperVariants> {
  /** Visible label rendered above the input. */
  label?: string;
  /** Helper text rendered below the input. */
  helperText?: string;
  /** Icon rendered inside the input on the left. */
  startIcon?: ReactNode;
  /** Icon rendered inside the input on the right. */
  endIcon?: ReactNode;
  /** Callback fired when the clear button is clicked. Shows an X button if provided. */
  onClear?: () => void;
  /** Padding for the start icon (number → px-{n}). @default 3 */
  startPadding?: number;
  /** Padding for the end icon (number → px-{n}). @default 3 */
  endPadding?: number;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      state,
      size,
      fullWidth = true,
      label,
      helperText,
      startIcon,
      endIcon,
      onClear,
      startPadding = 3,
      endPadding = 3,
      id: idProp,
      required,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const isError = state === "error";

    const inputPaddingX = size === "sm" ? "px-2.5" : size === "lg" ? "px-4" : "px-3";
    const internalRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
      if (onClear) {
        onClear();
        // optionally refocus
        internalRef.current?.focus();
      }
    };

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-[var(--text-sm)] font-[var(--font-weight-medium)]",
              "text-[var(--color-text-primary)]",
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-[var(--color-error)]" aria-hidden>
                *
              </span>
            )}
          </label>
        )}

        <div className={cn(inputWrapperVariants({ state, size, fullWidth }), className)}>
          {startIcon && (
            <span className={cn(adornmentClasses, `pl-${startPadding}`)}>{startIcon}</span>
          )}

          <input
            ref={(node) => {
              // Merge refs
              internalRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={id}
            required={required}
            disabled={disabled}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperId}
            className={cn(
              inputElementClasses,
              inputPaddingX,
              "py-0 h-full",
              focusRing({ width: "2", offset: "0" }).replace("focus:outline-none", ""),
            )}
            {...props}
          />

          {onClear && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className={cn(
                "flex items-center justify-center shrink-0",
                "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
                "transition-colors duration-[var(--duration-fast)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-full",
                endIcon ? "mr-1" : `mr-${endPadding}`,
              )}
              aria-label="Clear input"
            >
              <XIcon size={16} />
            </button>
          )}

          {endIcon && <span className={cn(adornmentClasses, `pr-${endPadding}`)}>{endIcon}</span>}
        </div>

        {helperText && (
          <p
            id={helperId}
            className={cn(
              "text-[var(--text-xs)]",
              isError ? "text-[var(--color-error)]" : "text-[var(--color-text-secondary)]",
            )}
            role={isError ? "alert" : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { inputWrapperVariants };
export type InputState = NonNullable<VariantProps<typeof inputWrapperVariants>["state"]>;
export type InputSize = NonNullable<VariantProps<typeof inputWrapperVariants>["size"]>;
