/**
 * Stack — vertical flex layout primitive.
 *
 * Renders a flex column that distributes its children with consistent
 * spacing. Every prop is typed and composable. Supports responsive
 * spacing via Tailwind utility classes on the `gap` prop.
 *
 * @example
 * <Stack gap={4}>
 *   <Text>First</Text>
 *   <Text>Second</Text>
 * </Stack>
 *
 * @example – align and justify
 * <Stack gap={2} align="center" justify="between">
 *   <Avatar />
 *   <span>Name</span>
 * </Stack>
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";

export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

const alignMap: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const wrapMap: Record<FlexWrap, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Gap between children. Accepts any valid Tailwind gap value or
   * a number corresponding to the spacing scale (e.g. 4 → `gap-4`).
   */
  gap?: number | string;
  /** Cross-axis alignment (items-*). @default "stretch" */
  align?: FlexAlign;
  /** Main-axis distribution (justify-*). @default "start" */
  justify?: FlexJustify;
  /** Flex wrap behaviour. @default "nowrap" */
  wrap?: FlexWrap;
  /** When true, renders children in reverse column order. */
  reverse?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      gap,
      align = "stretch",
      justify = "start",
      wrap = "nowrap",
      reverse = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const gapClass = gap !== undefined ? (typeof gap === "number" ? `gap-${gap}` : gap) : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          reverse ? "flex-col-reverse" : "flex-col",
          alignMap[align],
          justifyMap[justify],
          wrapMap[wrap],
          gapClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = "Stack";
