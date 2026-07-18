/**
 * Container — max-width + horizontal padding wrapper.
 *
 * Provides consistent page-level horizontal constraints. The `size` prop
 * maps to semantic container sizes rather than arbitrary pixel values.
 *
 * @example
 * <Container size="lg" center>
 *   <PageContent />
 * </Container>
 *
 * @example – with custom padding
 * <Container size="xl" px={8}>
 *   <HeroSection />
 * </Container>
 */
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn.js";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

const sizeMap: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm" /*  640px */,
  md: "max-w-screen-md" /*  768px */,
  lg: "max-w-screen-lg" /* 1024px */,
  xl: "max-w-screen-xl" /* 1280px */,
  "2xl": "max-w-screen-2xl" /* 1536px */,
  full: "max-w-full",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width preset. @default "xl" */
  size?: ContainerSize;
  /** Horizontally center the container. @default true */
  center?: boolean;
  /** Horizontal padding — number maps to px-{n}. @default 4 */
  px?: number | string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "xl", center = true, px = 4, className, children, ...props }, ref) => {
    const pxClass = typeof px === "number" ? `px-${px}` : px;

    return (
      <div
        ref={ref}
        className={cn("w-full", sizeMap[size], center && "mx-auto", pxClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";
