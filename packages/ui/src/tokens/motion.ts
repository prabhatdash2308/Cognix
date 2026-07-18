/**
 * Motion tokens — TypeScript constants.
 *
 * @example
 * import { motion } from "@cognix/ui/tokens";
 * transition={{ duration: parseFloat(motion.duration.normal) / 1000 }}
 */
export const duration = {
  instant: "50ms",
  fast:    "100ms",
  normal:  "200ms",
  slow:    "350ms",
  slower:  "500ms",
  lazy:    "800ms",
} as const;

export const easing = {
  linear:  "linear",
  in:      "cubic-bezier(0.4, 0, 1, 1)",
  out:     "cubic-bezier(0, 0, 0.2, 1)",
  inOut:   "cubic-bezier(0.4, 0, 0.2, 1)",
  spring:  "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const motion = {
  duration,
  easing,
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
