import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text rendered above the textarea */
  label?: string;
  /** Helper text rendered below */
  helperText?: string;
  /** Error message — sets aria-invalid and renders error state */
  error?: string;
  /** Auto-grow to fit content (up to maxRows) */
  autoResize?: boolean;
  /** Minimum visible rows */
  minRows?: number;
  /** Maximum rows before scroll kicks in (only with autoResize) */
  maxRows?: number;
  /** Stretch to fill container */
  fullWidth?: boolean;
}
