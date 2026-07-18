/**
 * focusRing — generates a consistent focus ring class string.
 *
 * Returns a Tailwind class string that implements the Cognix focus ring
 * using the design token `--color-border-focus`. Use this on any
 * interactive element that needs keyboard focus indication.
 *
 * The ring automatically uses the brand color and respects the current
 * theme via CSS variables.
 *
 * @param options.offset - Ring offset (distance between element border and ring).
 *   @default "2"
 * @param options.width - Ring thickness. @default "2"
 * @param options.inset - If true, uses focus-visible:ring-inset for elements
 *   where an outset ring would be clipped. @default false
 *
 * @returns A string of Tailwind utility classes.
 *
 * @example
 * <button className={cn("px-4 py-2", focusRing())}>Click me</button>
 *
 * @example – inset ring for inputs
 * <input className={cn("border rounded", focusRing({ inset: true }))} />
 *
 * @example – custom offset
 * <a className={cn(focusRing({ offset: "4" }))}>Link</a>
 */

export interface FocusRingOptions {
  /** Ring thickness. @default "2" */
  width?: "1" | "2" | "4";
  /** Distance between element border and ring. @default "2" */
  offset?: "0" | "1" | "2" | "4";
  /** Render ring inset (inside the element boundary). @default false */
  inset?: boolean;
  /**
   * Background color class for the ring offset.
   * Should match the element's background to create the illusion of an offset.
   * @default "ring-offset-[var(--color-bg)]"
   */
  offsetColor?: string;
}

export function focusRing(options: FocusRingOptions = {}): string {
  const {
    width = "2",
    offset = "2",
    inset = false,
    offsetColor = "ring-offset-[var(--color-bg)]",
  } = options;

  return [
    // Only show ring on keyboard focus, not click
    "focus:outline-none",
    "focus-visible:outline-none",
    `focus-visible:ring-${width}`,
    "focus-visible:ring-[var(--color-border-focus)]",
    inset ? "focus-visible:ring-inset" : `focus-visible:ring-offset-${offset}`,
    !inset && offsetColor,
    // Transition for smooth appearance
    "transition-shadow duration-[var(--duration-fast)]",
  ]
    .filter(Boolean)
    .join(" ");
}
