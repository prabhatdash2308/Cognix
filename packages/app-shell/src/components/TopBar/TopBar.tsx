/**
 * TopBar — the top navigation bar of the application shell.
 *
 * Sticky at the top of the viewport.
 * Contains:
 * - Left: Mobile hamburger menu (visible on mobile), Breadcrumbs (visible on desktop)
 * - Right: SearchButton, NotificationButton, UserMenu
 */
import { MenuIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs.js";
import { SearchButton } from "../SearchButton/SearchButton.js";
import { NotificationButton } from "../NotificationButton/NotificationButton.js";
import { UserMenu } from "../UserMenu/UserMenu.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface TopBarProps {
  className?: string;
  /** Custom action for UserMenu profile click */
  onProfile?: () => void;
  /** Custom action for UserMenu settings click */
  onSettings?: () => void;
  /** Custom action for UserMenu sign out click */
  onSignOut?: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function TopBar({
  className,
  onProfile,
  onSettings,
  onSignOut,
}: TopBarProps) {
  const { mobileNav, breadcrumbs } = useAppShell();

  return (
    <header
      aria-label="Top navigation bar"
      className={cn(
        "sticky top-0 z-[var(--z-sticky)]",
        "flex items-center justify-between",
        "h-14 px-4",
        "bg-[var(--color-surface)]/80 backdrop-blur-md",
        "border-b border-[var(--color-border)]",
        className
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={mobileNav.open}
          aria-label="Open mobile navigation"
          className={cn(
            "md:hidden",
            "flex items-center justify-center size-8 -ml-2",
            "rounded-[var(--radius-lg)]",
            "text-[var(--color-text-secondary)]",
            "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
          )}
        >
          <MenuIcon size={20} aria-hidden />
        </button>

        {/* Desktop breadcrumbs */}
        <div className="hidden md:block min-w-0">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-4">
        <SearchButton />
        <NotificationButton />
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" aria-hidden />
        <UserMenu
          {...(onProfile ? { onProfile } : {})}
          {...(onSettings ? { onSettings } : {})}
          {...(onSignOut ? { onSignOut } : {})}
        />
      </div>
    </header>
  );
}

TopBar.displayName = "TopBar";
