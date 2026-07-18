/**
 * NotificationButton — bell icon button with unread count badge.
 *
 * Accessible: aria-label dynamically includes unread count.
 * Badge caps at 99+ for display.
 */
import { BellIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NotificationButtonProps {
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function NotificationButton({ className }: NotificationButtonProps) {
  const { notifications } = useAppShell();
  const { unreadCount, onOpen } = notifications;
  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  const ariaLabel =
    unreadCount > 0
      ? `Notifications, ${unreadCount} unread`
      : "Notifications";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center",
        "rounded-[var(--radius-lg)]",
        "text-[var(--color-text-secondary)]",
        "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
        "transition-colors duration-[var(--duration-fast)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className
      )}
    >
      <BellIcon size={18} aria-hidden />

      {unreadCount > 0 && (
        <span
          aria-hidden
          className={cn(
            "absolute -top-0.5 -right-0.5",
            "flex items-center justify-center",
            "min-w-[16px] h-4 px-1",
            "rounded-[var(--radius-full)]",
            "bg-[var(--color-accent)] text-white",
            "text-[var(--text-2xs)] font-[var(--font-weight-bold)]",
            "leading-none select-none"
          )}
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}

NotificationButton.displayName = "NotificationButton";
