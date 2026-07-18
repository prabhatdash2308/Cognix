import type { ReactNode } from "react";

export type TabsVariant = "line" | "pill" | "enclosed";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabItem {
  /** Unique identifier for the tab */
  value: string;
  /** Display label */
  label: ReactNode;
  /** Content to render when active */
  content: ReactNode;
  /** Disable this tab */
  disabled?: boolean;
  /** Optional icon */
  icon?: ReactNode;
}

export interface TabsProps {
  /** The tabs to render */
  items: TabItem[];
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Value change handler */
  onValueChange?: (value: string) => void;
  /** Visual variant */
  variant?: TabsVariant;
  /** Orientation of the tab list */
  orientation?: TabsOrientation;
  /** Stretch tabs to fill width (horizontal only) */
  fullWidth?: boolean;
}
