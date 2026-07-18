import type { ReactNode } from "react";

export interface DropdownItemBase {
  type?: "item";
  /** Display label */
  label: ReactNode;
  /** Leading icon */
  icon?: ReactNode;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Destructive styling */
  destructive?: boolean;
  /** Click handler */
  onSelect?: () => void;
}

export interface DropdownSeparator {
  type: "separator";
}

export interface DropdownLabel {
  type: "label";
  label: ReactNode;
}

export interface DropdownCheckboxItem {
  type: "checkbox";
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export type DropdownMenuItem =
  DropdownItemBase | DropdownSeparator | DropdownLabel | DropdownCheckboxItem;

export type DropdownAlign = "start" | "center" | "end";
export type DropdownSide = "top" | "right" | "bottom" | "left";

export interface DropdownProps {
  /** Trigger element */
  trigger: ReactNode;
  /** Menu items */
  items: DropdownMenuItem[];
  /** Horizontal alignment relative to trigger */
  align?: DropdownAlign;
  /** Side to open relative to trigger */
  side?: DropdownSide;
  /** Controlled open */
  open?: boolean;
  /** Uncontrolled default open */
  defaultOpen?: boolean;
  /** Open change handler */
  onOpenChange?: (open: boolean) => void;
}
