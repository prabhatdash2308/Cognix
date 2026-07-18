/**
 * Inline — horizontal flex layout primitive.
 *
 * Distributes children in a row with consistent spacing and optional
 * wrapping. The horizontal counterpart to Stack.
 *
 * @example
 * <Inline gap={3} align="center">
 *   <SearchIcon />
 *   <span>Search</span>
 * </Inline>
 *
 * @example – wrap on small screens
 * <Inline gap={4} wrap="wrap">
 *   {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
 * </Inline>
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";
import type { FlexAlign, FlexJustify, FlexWrap } from "./Stack.js";

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

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between children — number maps to Tailwind gap-{n}. */
  gap?: number | string;
  /** Cross-axis (vertical) alignment. @default "center" */
  align?: FlexAlign;
  /** Main-axis (horizontal) distribution. @default "start" */
  justify?: FlexJustify;
  /** Flex wrap behaviour. @default "nowrap" */
  wrap?: FlexWrap;
  /** When true, renders children in reverse row order. */
  reverse?: boolean;
}

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    {
      gap,
      align = "center",
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
          reverse ? "flex-row-reverse" : "flex-row",
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

Inline.displayName = "Inline";
