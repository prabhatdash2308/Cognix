/**
 * visuallyHidden — class string that hides content visually while
 * keeping it accessible to screen readers.
 *
 * This is the canonical SR-only technique. Content with these classes
 * is still announced by screen readers and searchable but invisible
 * to sighted users.
 *
 * Two helpers are provided:
 *   - `visuallyHidden` — a static class string (use with cn())
 *   - `VisuallyHidden` — a React component for semantic convenience
 *
 * @example – class string
 * <button>
 *   <svg aria-hidden />
 *   <span className={visuallyHidden}>Delete item</span>
 * </button>
 *
 * @example – React component
 * <button>
 *   <PlusIcon aria-hidden />
 *   <VisuallyHidden>Add to cart</VisuallyHidden>
 * </button>
 *
 * @example – focusable (reveals on focus — skip-link pattern)
 * <VisuallyHidden as="a" href="#main" focusable>
 *   Skip to main content
 * </VisuallyHidden>
 */
import * as React from "react";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

/** Tailwind classes that implement the visually-hidden pattern. */
export const visuallyHidden =
  "absolute w-px h-px p-0 m-[-1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0" as const;

/**
 * Classes to apply when a visually-hidden element is focusable
 * and should become visible on focus (skip-link pattern).
 */
export const visuallyHiddenFocusable =
  "focus:static focus:w-auto focus:h-auto focus:p-2 focus:m-0 focus:overflow-visible focus:clip-auto focus:whitespace-normal" as const;

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render. @default "span" */
  as?: keyof HTMLElementTagNameMap;
  /**
   * When true, the element becomes visible when focused.
   * Use for skip-to-content links. @default false
   */
  focusable?: boolean;
}

/**
 * VisuallyHidden — a component that renders content hidden to sighted
 * users but visible to assistive technologies.
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: _tag = "span", focusable = false, className = "", children, ...props }, ref) => {
    const Tag = _tag as React.ElementType;

    const classes = [visuallyHidden, focusable ? visuallyHiddenFocusable : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
