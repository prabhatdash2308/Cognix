import { cn } from "../../utils/cn.js";
import type { SpinnerProps, SpinnerSize } from "./Spinner.types.js";

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/**
 * Spinner — animated loading indicator.
 *
 * Inherits color via `currentColor` so it adapts to any context.
 *
 * @example
 * <Spinner size="md" />
 * <Spinner size="sm" label="Saving…" />
 */
export function Spinner({ size = "md", label = "Loading…", className, ...props }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
      className={cn(sizeMap[size], "animate-spin text-[var(--color-accent)]", className)}
      {...props}
    >
      {/* Track */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      {/* Arc */}
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

Spinner.displayName = "Spinner";
