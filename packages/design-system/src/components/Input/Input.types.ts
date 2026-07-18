import type { InputHTMLAttributes, ReactNode } from "react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label text rendered above the input */
  label?: string;
  /** Helper text rendered below the input */
  helperText?: string;
  /** Error message — sets aria-invalid and renders error state */
  error?: string;
  /** Size preset */
  size?: InputSize;
  /** Node rendered at the start (inside the input) */
  startAdornment?: ReactNode;
  /** Node rendered at the end (inside the input) */
  endAdornment?: ReactNode;
  /** Stretch to fill container width */
  fullWidth?: boolean;
}
