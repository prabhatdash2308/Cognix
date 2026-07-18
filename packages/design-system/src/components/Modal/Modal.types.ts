import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open for uncontrolled */
  defaultOpen?: boolean;
  /** Open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element */
  trigger?: ReactNode;
  /** Dialog title (required for a11y) */
  title: ReactNode;
  /** Optional description below the title */
  description?: ReactNode;
  /** Main content area */
  children?: ReactNode;
  /** Footer content (e.g. action buttons) */
  footer?: ReactNode;
  /** Width preset */
  size?: ModalSize;
  /** Hide the default close button in the header */
  hideCloseButton?: boolean;
}
