import type React from "react";
import { forwardRef, useCallback, useEffect, useId, useRef } from "react";
import { cn } from "../../utils/cn.js";
import type { TextareaProps } from "./Textarea.types.js";

/**
 * Textarea — multi-line text field with optional auto-resize.
 *
 * @example
 * <Textarea label="Message" placeholder="Enter your message…" />
 * <Textarea label="Bio" autoResize minRows={3} maxRows={8} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      autoResize = false,
      minRows = 3,
      maxRows,
      fullWidth = false,
      id: idProp,
      disabled,
      className,
      onChange,
      ...props
    },
    forwardedRef,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const innerRef = useRef<HTMLTextAreaElement>(null);

    // Sync forwardedRef + innerRef
    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [forwardedRef],
    );

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;

      // Collapse to measure scrollHeight correctly
      el.style.height = "0px";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const paddingV =
        parseFloat(getComputedStyle(el).paddingTop) +
        parseFloat(getComputedStyle(el).paddingBottom);

      const minH = lineHeight * minRows + paddingV;
      const maxH = maxRows ? lineHeight * maxRows + paddingV : Infinity;

      el.style.height = `${Math.min(Math.max(el.scrollHeight, minH), maxH)}px`;
      el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
    }, [autoResize, minRows, maxRows]);

    useEffect(() => {
      resize();
    }, [resize, props.value, props.defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      resize();
      onChange?.(e);
    };

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
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

        <textarea
          ref={setRef}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          rows={minRows}
          onChange={handleChange}
          className={cn(
            "w-full resize-none",
            "px-3 py-2",
            "bg-[var(--color-surface)]",
            "text-[var(--text-sm)] text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "rounded-[var(--radius-md)]",
            "border",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            "focus:outline-none focus:border-[var(--color-border-focus)]",
            "focus:shadow-[var(--shadow-glow-brand)]",
            hasError
              ? "border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_1px_var(--color-error)]"
              : "border-[var(--color-border)]",
            disabled && "opacity-50 pointer-events-none",
            !autoResize && "resize-y",
          )}
          {...props}
        />

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

Textarea.displayName = "Textarea";
