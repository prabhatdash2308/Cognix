/**
 * SearchButton — trigger button for the Command Palette.
 *
 * Displays "Search…" placeholder text with a platform-appropriate
 * keyboard shortcut badge (⌘K on Mac, Ctrl K otherwise).
 * Clicking opens the CommandPalette.
 */
import { SearchIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SearchButtonProps {
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function SearchButton({ className }: SearchButtonProps) {
  const { commandPalette } = useAppShell();

  return (
    <button
      type="button"
      onClick={commandPalette.open}
      aria-label="Search or run commands (Ctrl+K)"
      aria-keyshortcuts="Control+k Meta+k"
      className={cn(
        "flex items-center gap-2",
        "h-8 px-3",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border)]",
        "bg-[var(--color-surface-raised)]",
        "text-[var(--color-text-tertiary)]",
        "hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]",
        "transition-colors duration-[var(--duration-fast)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className,
      )}
    >
      <SearchIcon size={14} aria-hidden />
      <span className="text-[var(--text-sm)] hidden sm:block">Search…</span>
      <kbd
        className={cn(
          "hidden sm:flex items-center gap-0.5",
          "text-[var(--text-2xs)] font-[var(--font-weight-medium)]",
          "text-[var(--color-text-tertiary)]",
          "border border-[var(--color-border)] rounded-[var(--radius-sm)]",
          "px-1 py-0.5 leading-none",
        )}
        aria-hidden
      >
        <span>⌘K</span>
      </kbd>
    </button>
  );
}

SearchButton.displayName = "SearchButton";
