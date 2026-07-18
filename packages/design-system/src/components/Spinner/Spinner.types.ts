import type { SVGAttributes } from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps extends SVGAttributes<SVGSVGElement> {
  /** Size preset */
  size?: SpinnerSize;
  /** Accessible label for screen readers */
  label?: string;
}
