/**
 * Grid — CSS grid layout primitive.
 *
 * Provides a composable, typed wrapper around CSS Grid with support
 * for fixed column counts, responsive columns, and configurable gaps.
 *
 * @example – fixed 3-column grid
 * <Grid cols={3} gap={6}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 *
 * @example – auto-fill responsive grid
 * <Grid cols="auto-fill" minColWidth="280px" gap={4}>
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </Grid>
 *
 * @example – spanning items (use standard Tailwind on children)
 * <Grid cols={12} gap={4}>
 *   <div className="col-span-8">Main content</div>
 *   <div className="col-span-4">Sidebar</div>
 * </Grid>
 */
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";

export type GridCols =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | "auto-fill"
  | "auto-fit"
  | "none";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns, or "auto-fill" / "auto-fit" for responsive grids.
   * @default "none"
   */
  cols?: GridCols;
  /**
   * Minimum column width for auto-fill / auto-fit mode.
   * @default "200px"
   */
  minColWidth?: string;
  /** Gap between cells — number maps to gap-{n}. */
  gap?: number | string;
  /** Column gap only — number maps to gap-x-{n}. */
  gapX?: number | string;
  /** Row gap only — number maps to gap-y-{n}. */
  gapY?: number | string;
  /** Number of rows (sets grid-template-rows). */
  rows?: number | string;
  /** Align items on the block axis. */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify items on the inline axis. */
  justify?: "start" | "center" | "end" | "stretch";
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",   2: "grid-cols-2",  3: "grid-cols-3",
  4: "grid-cols-4",   5: "grid-cols-5",  6: "grid-cols-6",
  7: "grid-cols-7",   8: "grid-cols-8",  9: "grid-cols-9",
  10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
};

const alignMap: Record<string, string> = {
  start:   "items-start",
  center:  "items-center",
  end:     "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<string, string> = {
  start:   "justify-items-start",
  center:  "justify-items-center",
  end:     "justify-items-end",
  stretch: "justify-items-stretch",
};

function gapClass(prefix: string, value: number | string): string {
  return typeof value === "number" ? `${prefix}-${value}` : value;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = "none",
      minColWidth = "200px",
      gap,
      gapX,
      gapY,
      rows,
      align,
      justify,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isAutoMode = cols === "auto-fill" || cols === "auto-fit";

    const colsClass =
      isAutoMode
        ? undefined // handled via inline style
        : typeof cols === "number"
          ? colsMap[cols]
          : undefined;

    const inlineStyle: CSSProperties = {
      ...style,
      ...(isAutoMode
        ? {
            gridTemplateColumns: `repeat(${cols}, minmax(${minColWidth}, 1fr))`,
          }
        : {}),
      ...(rows !== undefined
        ? {
            gridTemplateRows:
              typeof rows === "number" ? `repeat(${rows}, 1fr)` : rows,
          }
        : {}),
    };

    return (
      <div
        ref={ref}
        style={inlineStyle}
        className={cn(
          "grid",
          colsClass,
          gap !== undefined && gapClass("gap", gap),
          gapX !== undefined && gapClass("gap-x", gapX),
          gapY !== undefined && gapClass("gap-y", gapY),
          align !== undefined && alignMap[align],
          justify !== undefined && justifyMap[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
