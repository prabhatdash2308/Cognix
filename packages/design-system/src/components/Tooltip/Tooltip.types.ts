import type { ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** The tooltip content */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Which side to render the tooltip */
  side?: TooltipSide;
  /** Alignment relative to the trigger */
  align?: TooltipAlign;
  /** Delay in ms before showing */
  delayDuration?: number;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open */
  defaultOpen?: boolean;
  /** Open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Extra class on the content element */
  contentClassName?: string;
}
