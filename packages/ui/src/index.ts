/**
 * @cognix/ui — Design Foundation
 *
 * The single source of truth for all Cognix UI primitives.
 *
 * ─── Utilities ────────────────────────────────────────────────────────────
 * @see ./utils/cn          — class name merging
 * @see ./utils/focusRing   — focus ring class builder
 * @see ./utils/visuallyHidden — screen reader only pattern
 *
 * ─── Tokens ───────────────────────────────────────────────────────────────
 * @see ./tokens/colors     — color scale + semantic aliases
 * @see ./tokens/typography — font families, sizes, weights
 * @see ./tokens/spacing    — spacing scale
 * @see ./tokens/radius     — border radius scale
 * @see ./tokens/shadows    — shadow presets
 * @see ./tokens/motion     — durations + easing curves
 * @see ./tokens/icons      — icon size scale
 * @see ./tokens/zIndex     — stacking layer system
 *
 * ─── Providers ────────────────────────────────────────────────────────────
 * @see ./providers/ThemeProvider — light/dark/system theme context
 *
 * ─── Hooks ────────────────────────────────────────────────────────────────
 * @see ./hooks/useTheme       — access + control active theme
 * @see ./hooks/useMounted     — SSR hydration guard
 * @see ./hooks/useMediaQuery  — reactive matchMedia
 * @see ./hooks/useBreakpoint  — named breakpoint flags
 *
 * ─── Layout ───────────────────────────────────────────────────────────────
 * @see ./layout/Stack     — vertical flex
 * @see ./layout/Inline    — horizontal flex
 * @see ./layout/Grid      — CSS grid
 * @see ./layout/Container — max-width wrapper
 * @see ./layout/Spacer    — flexible whitespace
 * @see ./layout/Separator — accessible divider
 */

// ─── Utilities ─────────────────────────────────────────────────────────────
export * from "./utils/index.js";

// ─── Tokens ────────────────────────────────────────────────────────────────
export * from "./tokens/index.js";

// ─── Providers ─────────────────────────────────────────────────────────────
export * from "./providers/index.js";

// ─── Hooks ─────────────────────────────────────────────────────────────────
export * from "./hooks/index.js";

// ─── Layout Primitives ─────────────────────────────────────────────────────
export * from "./layout/index.js";

// ─── Components ────────────────────────────────────────────────────────────
export * from "./components/index.js";
