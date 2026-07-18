/**
 * Sidebar — the primary navigation sidebar for the Cognix app shell.
 *
 * Features:
 * - Collapsible: 240px expanded, 56px collapsed
 * - CSS-animated smooth width transition
 * - Workspace switcher at the top
 * - Hover-expand mode when collapsed (configurable)
 * - Navigation sections rendered from context
 * - Collapse toggle button at the bottom
 * - Full keyboard navigation
 *
 * Accessibility:
 * - role="navigation" + aria-label="Main navigation"
 * - aria-expanded on collapse toggle button
 */
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher/WorkspaceSwitcher.js";
import { SidebarSection } from "../SidebarSection/SidebarSection.js";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const SIDEBAR_WIDTH = "240px";
const SIDEBAR_COLLAPSED_WIDTH = "56px";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SidebarProps {
  /** Called when user clicks "Create workspace" in the WorkspaceSwitcher. */
  onCreateWorkspace?: () => void;
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function Sidebar({ onCreateWorkspace, className }: SidebarProps) {
  const { sidebar, nav } = useAppShell();
  const {
    collapsed,
    isExpanded,
    toggle,
    onHoverEnter,
    onHoverLeave,
  } = sidebar;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: isExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        minWidth: isExpanded ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
      }}
      className={cn(
        "relative flex flex-col h-full",
        "bg-[var(--color-surface-raised)]",
        "border-r border-[var(--color-border)]",
        "transition-[width,min-width] duration-[var(--duration-normal)] ease-[var(--ease-in-out)]",
        "overflow-hidden",
        "z-[var(--z-sticky)]",
        className
      )}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {/* ── Workspace Switcher ── */}
      <div
        className={cn(
          "flex items-center h-14 shrink-0",
          isExpanded ? "px-3 border-b border-[var(--color-border)]" : "justify-center border-b border-[var(--color-border)] px-0"
        )}
      >
        {isExpanded ? (
          <WorkspaceSwitcher {...(onCreateWorkspace ? { onCreateWorkspace } : {})} />
        ) : (
          <button
            type="button"
            aria-label="Open workspace switcher"
            className={cn(
              "flex items-center justify-center size-8",
              "rounded-[var(--radius-lg)]",
              "hover:bg-[var(--color-surface-hover)]",
              "transition-colors duration-[var(--duration-fast)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
            )}
          >
            {/* Workspace initials icon */}
            <WorkspaceIconOnly />
          </button>
        )}
      </div>

      {/* ── Navigation sections ── */}
      <div className={cn("flex-1 overflow-y-auto overflow-x-hidden py-3", isExpanded ? "px-3" : "px-2")}>
        <div className="space-y-4">
          {nav.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </div>

      {/* ── Collapse Toggle ── */}
      <div className={cn("shrink-0 border-t border-[var(--color-border)] py-3", isExpanded ? "px-3" : "px-2")}>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex items-center gap-3 w-full",
            "rounded-[var(--radius-lg)]",
            "text-[var(--color-text-tertiary)]",
            "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
            isExpanded ? "px-3 py-2" : "px-0 py-2 justify-center"
          )}
        >
          {collapsed ? (
            <PanelLeftOpenIcon size={18} aria-hidden />
          ) : (
            <PanelLeftCloseIcon size={18} aria-hidden />
          )}
          {isExpanded && (
            <span className="text-[var(--text-sm)]">
              {collapsed ? "Expand" : "Collapse"}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

/* ─── WorkspaceIconOnly ────────────────────────────────────────────────────── */

function WorkspaceIconOnly() {
  const { currentWorkspace } = useAppShell();
  if (currentWorkspace.iconUrl) {
    return (
      <img
        src={currentWorkspace.iconUrl}
        alt={currentWorkspace.name}
        className="size-6 rounded-[var(--radius-sm)] object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "size-6 rounded-[var(--radius-sm)] shrink-0",
        "flex items-center justify-center",
        "bg-[var(--color-accent)] text-white",
        "text-[var(--text-2xs)] font-[var(--font-weight-bold)]",
        "leading-none select-none uppercase"
      )}
    >
      {currentWorkspace.initials.slice(0, 2)}
    </span>
  );
}

Sidebar.displayName = "Sidebar";
