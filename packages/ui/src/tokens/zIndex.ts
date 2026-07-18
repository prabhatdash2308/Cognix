/**
 * Z-index tokens — TypeScript constants.
 *
 * Defines the stacking layer system used across all UI surfaces.
 * Components MUST use these values — never hardcode z-index values.
 *
 * @example
 * import { zIndex } from "@cognix/ui/tokens";
 * style={{ zIndex: zIndex.modal }}
 */
export const zIndex = {
  hide:     -1,
  base:      0,
  raised:    10,
  dropdown:  1000,
  sticky:    1100,
  overlay:   1200,
  modal:     1300,
  popover:   1400,
  tooltip:   1500,
  toast:     1600,
  max:       9999,
} as const;

export type ZIndexKey = keyof typeof zIndex;
export type ZIndexValue = typeof zIndex[ZIndexKey];
