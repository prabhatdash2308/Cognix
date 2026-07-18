/**
 * Separator — accessible visual divider.
 *
 * Renders a styled `<hr>` with `role="separator"` for horizontal mode
 * or `role="separator" aria-orientation="vertical"` for vertical mode.
 *
 * The visual appearance adapts to the current theme via CSS variables.
 *
 * @example – horizontal (default)
 * <Stack gap={4}>
 *   <Section />
 *   <Separator />
 *   <Section />
 * </Stack>
 *
 * @example – vertical in a toolbar
 * <Inline gap={2} align="center">
 *   <Button variant="ghost">Bold</Button>
 *   <Separator orientation="vertical" />
 *   <Button variant="ghost">Italic</Button>
 * </Inline>
 *
 * @example – decorative (hidden from AT)
 * <Separator decorative />
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation of the separator. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /**
   * When true, the separator is purely decorative and hidden from
   * screen readers (sets aria-hidden). @default false
   */
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      decorative = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <hr
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-hidden={decorative}
        aria-orientation={orientation}
        className={cn(
          "border-0 bg-[var(--color-border)] shrink-0",
          orientation === "horizontal"
            ? "h-px w-full"
            : "w-px self-stretch",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
