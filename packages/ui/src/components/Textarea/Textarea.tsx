/**
 * Textarea — multi-line text field with optional auto-resize.
 *
 * Shares the same state and size variants as Input for visual consistency.
 * Supports auto-resize (grows with content), fixed rows, and all native
 * textarea attributes via forwardRef.
 *
 * @example – basic
 * <Textarea label="Message" placeholder="Tell us more…" rows={4} />
 *
 * @example – auto-resize (no scrollbar)
 * <Textarea label="Notes" autoResize minRows={3} maxRows={12} />
 *
 * @example – error state
 * <Textarea
 *   label="Bio"
 *   state="error"
 *   helperText="Bio must be at least 20 characters."
 *   maxLength={500}
 * />
 */
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn.js";

/* ─── Variants ───────────────────────────────────────────────────────────── */

const textareaVariants = cva(
  [
    "w-full",
    "rounded-[var(--radius-lg)]",
    "border",
    "bg-[var(--color-surface)]",
    "text-[var(--color-text-primary)]",
    "placeholder:text-[var(--color-text-tertiary)]",
    "resize-none outline-none",
    "transition-colors duration-[var(--duration-fast)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    // autofill fix
    "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text-primary)]",
  ].join(" "),
  {
    variants: {
      state: {
        default: [
          "border-[var(--color-border)]",
          "hover:border-[var(--color-border-strong)]",
          "focus-visible:border-[var(--color-border-focus)]",
          "focus-visible:shadow-[var(--shadow-focus)]",
          "focus-visible:outline-none focus-visible:ring-0",
        ].join(" "),
        error: [
          "border-[var(--color-error)]",
          "focus-visible:border-[var(--color-error)]",
          "focus-visible:shadow-[0_0_0_3px_var(--color-error-light)]",
          "focus-visible:outline-none focus-visible:ring-0",
        ].join(" "),
        success: [
          "border-[var(--color-success)]",
          "focus-visible:border-[var(--color-success)]",
          "focus-visible:shadow-[0_0_0_3px_var(--color-success-light)]",
          "focus-visible:outline-none focus-visible:ring-0",
        ].join(" "),
      },
      size: {
        sm: "px-2.5 py-1.5 text-[var(--text-xs)]",
        md: "px-3   py-2   text-[var(--text-sm)]",
        lg: "px-4   py-2.5 text-[var(--text-base)]",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  /** Visible label rendered above the textarea. */
  label?: string;
  /** Helper / description text rendered below. Shows in red for errors. */
  helperText?: string;
  /**
   * When true, the textarea grows with its content automatically.
   * Disables the native resize handle.
   * @default false
   */
  autoResize?: boolean;
  /** Minimum number of visible rows when `autoResize` is true. @default 3 */
  minRows?: number;
  /** Maximum number of rows before the textarea scrolls. @default undefined */
  maxRows?: number;
}

/* ─── Auto-resize helper ─────────────────────────────────────────────────── */

function adjustHeight(
  el: HTMLTextAreaElement,
  minRows: number,
  maxRows?: number
): void {
  // Reset to auto so shrink works correctly
  el.style.height = "auto";

  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
  const paddingY =
    parseFloat(getComputedStyle(el).paddingTop) +
    parseFloat(getComputedStyle(el).paddingBottom);

  const minH = lineHeight * minRows + paddingY;
  const scrollH = el.scrollHeight;
  const maxH = maxRows !== undefined ? lineHeight * maxRows + paddingY : Infinity;

  el.style.height = `${Math.min(Math.max(scrollH, minH), maxH)}px`;
  el.style.overflowY = scrollH > maxH ? "auto" : "hidden";
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      state,
      size,
      label,
      helperText,
      autoResize = false,
      minRows = 3,
      maxRows,
      rows,
      id: idProp,
      required,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = helperText ? `${id}-helper` : undefined;
    const isError = state === "error";

    // Track character count for maxLength display
    const [charCount, setCharCount] = useState<number>(
      typeof props.value === "string"
        ? props.value.length
        : typeof props.defaultValue === "string"
          ? props.defaultValue.length
          : typeof props.value === "number" || typeof props.defaultValue === "number"
            ? String(props.value ?? props.defaultValue).length
            : 0
    );

    // Internal ref for auto-resize — merges with forwarded ref
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        internalRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref]
    );

    // Initial adjustment
    useEffect(() => {
      if (autoResize && internalRef.current) {
        adjustHeight(internalRef.current, minRows, maxRows);
      }
    }, [autoResize, minRows, maxRows]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize && internalRef.current) {
          adjustHeight(internalRef.current, minRows, maxRows);
        }
        if (props.maxLength) {
          setCharCount(e.target.value.length);
        }
        onChange?.(e);
      },
      [autoResize, minRows, maxRows, props.maxLength, onChange]
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--color-text-primary)]"
          >
            {label}
            {required && (
              <span className="ml-1 text-[var(--color-error)]" aria-hidden>
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={setRefs}
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={isError}
          aria-describedby={helperId}
          rows={autoResize ? undefined : (rows ?? minRows)}
          onChange={handleChange}
          className={cn(
            textareaVariants({ state, size }),
            autoResize && "resize-none overflow-hidden",
            className
          )}
          {...props}
        />

        {(helperText || props.maxLength) && (
          <div className="flex items-start justify-between w-full">
            {helperText && (
              <p
                id={helperId}
                className={cn(
                  "text-[var(--text-xs)]",
                  isError
                    ? "text-[var(--color-error)]"
                    : "text-[var(--color-text-secondary)]"
                )}
                role={isError ? "alert" : undefined}
              >
                {helperText}
              </p>
            )}
            {!helperText && <span />}
          {props.maxLength && (
            <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] shrink-0 ml-auto pl-4">
              {charCount} / {props.maxLength}
            </span>
          )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { textareaVariants };
export type TextareaState = NonNullable<VariantProps<typeof textareaVariants>["state"]>;
export type TextareaSize = NonNullable<VariantProps<typeof textareaVariants>["size"]>;
