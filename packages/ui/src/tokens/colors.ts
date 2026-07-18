/**
 * Color tokens — TypeScript constants.
 *
 * Values mirror the CSS variables declared in tokens.css.
 * Use these in JS logic (e.g. canvas drawing, dynamic styles, tests).
 * In component markup, prefer the CSS variable form directly.
 *
 * @example
 * import { colors } from "@cognix/ui/tokens";
 * ctx.fillStyle = colors.brand[500];
 */

/** Raw brand scale (Indigo / Violet, oklch) */
export const brandColors = {
  50:  "oklch(0.974 0.015 275)",
  100: "oklch(0.944 0.035 275)",
  200: "oklch(0.888 0.072 275)",
  300: "oklch(0.816 0.120 275)",
  400: "oklch(0.726 0.165 275)",
  500: "oklch(0.627 0.200 275)",
  600: "oklch(0.546 0.210 275)",
  700: "oklch(0.456 0.195 275)",
  800: "oklch(0.374 0.162 275)",
  900: "oklch(0.305 0.122 275)",
  950: "oklch(0.218 0.082 275)",
} as const;

/** Raw neutral scale (Slate, oklch) */
export const neutralColors = {
  0:    "oklch(1.000 0.000   0)",
  50:   "oklch(0.984 0.003 247)",
  100:  "oklch(0.967 0.005 252)",
  200:  "oklch(0.930 0.010 252)",
  300:  "oklch(0.872 0.015 252)",
  400:  "oklch(0.707 0.022 252)",
  500:  "oklch(0.556 0.022 252)",
  600:  "oklch(0.446 0.018 252)",
  700:  "oklch(0.367 0.015 252)",
  800:  "oklch(0.280 0.012 252)",
  850:  "oklch(0.220 0.010 252)",
  900:  "oklch(0.168 0.008 252)",
  950:  "oklch(0.110 0.005 252)",
  1000: "oklch(0.000 0.000   0)",
} as const;

/** Semantic status colors */
export const statusColors = {
  success: {
    light: "oklch(0.902 0.095 145)",
    DEFAULT: "oklch(0.648 0.158 145)",
    dark: "oklch(0.430 0.116 145)",
  },
  warning: {
    light: "oklch(0.950 0.100  80)",
    DEFAULT: "oklch(0.762 0.180  80)",
    dark: "oklch(0.520 0.140  80)",
  },
  error: {
    light: "oklch(0.930 0.085  20)",
    DEFAULT: "oklch(0.638 0.208  20)",
    dark: "oklch(0.420 0.150  20)",
  },
  info: {
    light: "oklch(0.920 0.065 220)",
    DEFAULT: "oklch(0.596 0.165 220)",
    dark: "oklch(0.400 0.120 220)",
  },
} as const;

/** CSS variable references for semantic aliases (safe in any context) */
export const semanticColors = {
  bg:               "var(--color-bg)",
  bgRaised:         "var(--color-bg-raised)",
  bgOverlay:        "var(--color-bg-overlay)",
  bgSunken:         "var(--color-bg-sunken)",
  surface:          "var(--color-surface)",
  surfaceRaised:    "var(--color-surface-raised)",
  surfaceHover:     "var(--color-surface-hover)",
  surfaceActive:    "var(--color-surface-active)",
  border:           "var(--color-border)",
  borderStrong:     "var(--color-border-strong)",
  borderFocus:      "var(--color-border-focus)",
  textPrimary:      "var(--color-text-primary)",
  textSecondary:    "var(--color-text-secondary)",
  textTertiary:     "var(--color-text-tertiary)",
  textDisabled:     "var(--color-text-disabled)",
  textInverse:      "var(--color-text-inverse)",
  textLink:         "var(--color-text-link)",
  textLinkHover:    "var(--color-text-link-hover)",
  accent:           "var(--color-accent)",
  accentHover:      "var(--color-accent-hover)",
  accentActive:     "var(--color-accent-active)",
  accentSubtle:     "var(--color-accent-subtle)",
  accentForeground: "var(--color-accent-foreground)",
} as const;

export const colors = {
  brand:   brandColors,
  neutral: neutralColors,
  status:  statusColors,
  semantic: semanticColors,
} as const;

export type BrandColorStep = keyof typeof brandColors;
export type NeutralColorStep = keyof typeof neutralColors;
