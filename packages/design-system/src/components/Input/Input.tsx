import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn.js";
import type { InputProps, InputSize } from "./Input.types.js";

const sizeStyles: Record<InputSize, { wrapper: string; input: string }> = {
  sm: {
    wrapper: "h-8",
    input: "text-[var(--text-xs)] px-2.5",
  },
  md: {
    wrapper: "h-9",
    input: "text-[var(--text-sm)] px-3",
  },
  lg: {
    wrapper: "h-11",
    input: "text-[var(--text-base)] px-4",
  },
};

/**
 * Input — single-line text field with label, helper text, error, and adornments.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="API Key" error="Invalid key" startAdornment={<KeyIcon />} />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      startAdornment,
      endAdornment,
      fullWidth = false,
      id: idProp,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const { wrapper, input } = sizeStyles[size];

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-[var(--text-sm)] font-[var(--font-weight-medium)]",
              "text-[var(--color-text-primary)]",
              disabled && "opacity-50",
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div
          className={cn(
            "relative flex items-center",
            "rounded-[var(--radius-md)]",
            "border",
            "bg-[var(--color-surface)]",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "focus-within:border-[var(--color-border-focus)]",
            "focus-within:shadow-[var(--shadow-glow-brand)]",
            hasError
              ? "border-[var(--color-error)] focus-within:border-[var(--color-error)] focus-within:shadow-[0_0_0_1px_var(--color-error)]"
              : "border-[var(--color-border)]",
            disabled && "opacity-50 pointer-events-none",
            wrapper,
          )}
        >
          {/* Start adornment */}
          {startAdornment && (
            <span
              className="absolute left-3 flex shrink-0 items-center text-[var(--color-text-tertiary)]"
              aria-hidden
            >
              {startAdornment}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full h-full bg-transparent",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-tertiary)]",
              "focus:outline-none",
              input,
              startAdornment && "pl-9",
              endAdornment && "pr-9",
            )}
            {...props}
          />

          {/* End adornment */}
          {endAdornment && (
            <span
              className="absolute right-3 flex shrink-0 items-center text-[var(--color-text-tertiary)]"
              aria-hidden
            >
              {endAdornment}
            </span>
          )}
        </div>

        {/* Helper / Error text */}
        {error ? (
          <p id={errorId} role="alert" className="text-[var(--text-xs)] text-[var(--color-error)]">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
