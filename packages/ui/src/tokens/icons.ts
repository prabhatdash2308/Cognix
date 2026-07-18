/**
 * Icon size tokens — TypeScript constants.
 *
 * Used to size Lucide React icons consistently across the design system.
 *
 * @example
 * import { iconSizes } from "@cognix/ui/tokens";
 * <SearchIcon size={iconSizes.md} />
 */
export const iconSizes = {
  xs: 12 /* 0.75rem */,
  sm: 16 /* 1rem    */,
  md: 20 /* 1.25rem */,
  lg: 24 /* 1.5rem  */,
  xl: 32 /* 2rem    */,
  "2xl": 48 /* 3rem    */,
} as const;

/** CSS variable references for icon sizes */
export const iconSizesCss = {
  xs: "var(--icon-xs)",
  sm: "var(--icon-sm)",
  md: "var(--icon-md)",
  lg: "var(--icon-lg)",
  xl: "var(--icon-xl)",
  "2xl": "var(--icon-2xl)",
} as const;

export type IconSizeKey = keyof typeof iconSizes;
