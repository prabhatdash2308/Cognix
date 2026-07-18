/**
 * Shadow tokens — TypeScript constants.
 *
 * Values use CSS variable references so they automatically adapt to
 * light/dark mode via the ThemeProvider.
 *
 * @example
 * import { shadows } from "@cognix/ui/tokens";
 * style={{ boxShadow: shadows.md }}
 */
export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  "2xl": "var(--shadow-2xl)",
  inner: "var(--shadow-inner)",
  focus: "var(--shadow-focus)",
  glow: "var(--shadow-glow)",
  none: "none",
} as const;

export type ShadowKey = keyof typeof shadows;
