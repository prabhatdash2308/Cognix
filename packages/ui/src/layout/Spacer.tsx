/**
 * Spacer — flexible whitespace that fills available space.
 *
 * Renders a `<div>` with `flex: 1` to push siblings to the edges of a
 * flex container. Optionally accepts a fixed `size` to render a fixed
 * gap instead of a greedy expander.
 *
 * @example – push actions to the right edge of a toolbar
 * <Inline>
 *   <Logo />
 *   <Spacer />
 *   <Button>Sign in</Button>
 * </Inline>
 *
 * @example – fixed vertical gap
 * <Stack>
 *   <Header />
 *   <Spacer size={8} axis="vertical" />
 *   <Content />
 * </Stack>
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * When provided, renders a fixed-size spacer instead of a flex expander.
   * Number maps to the Tailwind spacing scale (e.g. 4 → 1rem).
   */
  size?: number | string;
  /**
   * Axis in which the fixed size applies.
   * Only relevant when `size` is set.
   * @default "horizontal"
   */
  axis?: "horizontal" | "vertical" | "both";
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, axis = "horizontal", className, style, ...props }, ref) => {
    if (size === undefined) {
      // Greedy flex expander
      return (
        <div ref={ref} aria-hidden className={cn("flex-1", className)} style={style} {...props} />
      );
    }

    // Fixed-size spacer
    const sizeValue = typeof size === "number" ? `${size * 0.25}rem` : size;

    const dimensionStyle: React.CSSProperties = {
      ...style,
      ...(axis === "horizontal" || axis === "both"
        ? { width: sizeValue, minWidth: sizeValue }
        : {}),
      ...(axis === "vertical" || axis === "both"
        ? { height: sizeValue, minHeight: sizeValue }
        : {}),
    };

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("shrink-0", className)}
        style={dimensionStyle}
        {...props}
      />
    );
  },
);

Spacer.displayName = "Spacer";
