/**
 * Typography tokens — TypeScript constants.
 *
 * Values mirror the CSS variables in tokens.css.
 *
 * @example
 * import { typography } from "@cognix/ui/tokens";
 * style={{ fontSize: typography.fontSize.sm }}
 */

export const fontFamily = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
  display: "var(--font-display)",
} as const;

/** Font sizes in rem */
export const fontSize = {
  "2xs": "0.625rem" /* 10px */,
  xs: "0.75rem" /* 12px */,
  sm: "0.875rem" /* 14px */,
  base: "1rem" /* 16px */,
  lg: "1.125rem" /* 18px */,
  xl: "1.25rem" /* 20px */,
  "2xl": "1.5rem" /* 24px */,
  "3xl": "1.875rem" /* 30px */,
  "4xl": "2.25rem" /* 36px */,
  "5xl": "3rem" /* 48px */,
  "6xl": "3.75rem" /* 60px */,
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const letterSpacing = {
  tighter: "-0.04em",
  tight: "-0.02em",
  normal: "0em",
  wide: "0.02em",
  wider: "0.05em",
  widest: "0.10em",
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} as const;

export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
