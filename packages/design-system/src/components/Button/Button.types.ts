import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Render icon before label */
  iconStart?: React.ReactNode;
  /** Render icon after label */
  iconEnd?: React.ReactNode;
  /** Render as icon-only button (square, no label padding) */
  iconOnly?: boolean;
}
