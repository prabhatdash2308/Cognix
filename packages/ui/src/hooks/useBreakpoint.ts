/**
 * useBreakpoint — named breakpoint detection built on top of useMediaQuery.
 *
 * Breakpoints mirror Tailwind CSS's default breakpoint scale.
 * Each flag is `true` when the viewport is AT OR ABOVE that breakpoint.
 *
 * Breakpoints:
 *   sm  → 640px
 *   md  → 768px
 *   lg  → 1024px
 *   xl  → 1280px
 *   2xl → 1536px
 *
 * SSR-safe: all flags return `false` on the server and on the first render.
 *
 * @example
 * import { useBreakpoint } from "@cognix/ui";
 *
 * function Layout() {
 *   const { md, lg } = useBreakpoint();
 *   return md ? <DesktopNav /> : <MobileNav />;
 * }
 *
 * @example – single breakpoint
 * import { useIsBreakpoint } from "@cognix/ui";
 *
 * function Component() {
 *   const isLg = useIsBreakpoint("lg");
 *   return <div>{isLg ? "Wide" : "Narrow"}</div>;
 * }
 */
import { useMediaQuery } from "./useMediaQuery.js";

/** Tailwind-compatible breakpoint definitions */
export const breakpoints = {
  sm:  "640px",
  md:  "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

export interface BreakpointState {
  /** ≥ 640px */
  sm: boolean;
  /** ≥ 768px */
  md: boolean;
  /** ≥ 1024px */
  lg: boolean;
  /** ≥ 1280px */
  xl: boolean;
  /** ≥ 1536px */
  "2xl": boolean;
}

/**
 * Returns an object with boolean flags for each named breakpoint.
 * A flag is `true` when the viewport width is at or above that breakpoint.
 */
export function useBreakpoint(): BreakpointState {
  const sm  = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const md  = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const lg  = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const xl  = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const xxl = useMediaQuery(`(min-width: ${breakpoints["2xl"]})`);

  return { sm, md, lg, xl, "2xl": xxl };
}

/**
 * Returns `true` when the viewport is at or above the given breakpoint.
 *
 * @param bp - Breakpoint name: "sm" | "md" | "lg" | "xl" | "2xl"
 */
export function useIsBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[bp]})`);
}
