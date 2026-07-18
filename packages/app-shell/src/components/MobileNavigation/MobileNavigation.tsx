/**
 * MobileNavigation — slide-in drawer navigation for mobile viewports.
 *
 * Built on Radix Dialog for proper focus trapping, backdrop, and
 * accessibility. Renders the same nav structure as the sidebar.
 *
 * Triggered by the hamburger button in TopBar.
 * Closes on overlay click, Escape key, or navigation.
 */
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { XIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";
import { SidebarSection } from "../SidebarSection/SidebarSection.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface MobileNavigationProps {
  /** Called when user clicks "Create workspace". */
  onCreateWorkspace?: () => void;
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function MobileNavigation({
  onCreateWorkspace: _onCreateWorkspace,
  className,
}: MobileNavigationProps) {
  const { mobileNav, nav, currentWorkspace } = useAppShell();

  return (
    <Dialog.Root open={mobileNav.isOpen} onOpenChange={(open) => { if (!open) mobileNav.close(); }}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[var(--z-overlay)]",
            "bg-black/60 backdrop-blur-sm",
            "animate-in fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />

        {/* Drawer panel */}
        <Dialog.Content
          aria-label="Mobile navigation"
          className={cn(
            "fixed left-0 top-0 bottom-0 z-[var(--z-modal)]",
            "w-[280px] max-w-[85vw]",
            "flex flex-col",
            "bg-[var(--color-surface-raised)]",
            "border-r border-[var(--color-border)]",
            "shadow-[var(--shadow-xl)]",
            "animate-in slide-in-from-left-full duration-[var(--duration-normal)]",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full",
            "focus:outline-none",
            className
          )}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Navigation</Dialog.Title>
          </VisuallyHidden.Root>

          {/* Header */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)] shrink-0">
            <div className="flex items-center gap-2.5">
              {currentWorkspace.iconUrl ? (
                <img
                  src={currentWorkspace.iconUrl}
                  alt={currentWorkspace.name}
                  className="size-6 rounded-[var(--radius-sm)] object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    "size-6 rounded-[var(--radius-sm)] shrink-0",
                    "flex items-center justify-center",
                    "bg-[var(--color-accent)] text-white",
                    "text-[var(--text-2xs)] font-[var(--font-weight-bold)]",
                    "uppercase leading-none"
                  )}
                >
                  {currentWorkspace.initials.slice(0, 2)}
                </span>
              )}
              <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] truncate max-w-[160px]">
                {currentWorkspace.name}
              </span>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation"
                className={cn(
                  "flex items-center justify-center size-8",
                  "rounded-[var(--radius-lg)]",
                  "text-[var(--color-text-tertiary)]",
                  "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                )}
              >
                <XIcon size={18} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          {/* Nav sections */}
          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto px-3 py-3"
          >
            <div className="space-y-4">
              {nav.map((section) => (
                <SidebarSection
                  key={section.id}
                  section={section}
                  isExpanded={true}
                />
              ))}
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

MobileNavigation.displayName = "MobileNavigation";
