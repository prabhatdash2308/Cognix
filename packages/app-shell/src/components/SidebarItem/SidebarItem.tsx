/**
 * SidebarItem — a single navigation item in the sidebar.
 *
 * Supports:
 * - Icon + label (label hidden + tooltip shown when sidebar is collapsed)
 * - Optional badge count
 * - Active state (aria-current="page", accent styling)
 * - Nested children (expandable sub-nav)
 * - Keyboard accessible: Enter/Space to activate, ArrowRight to expand
 *
 * @example
 * <SidebarItem
 *   item={{ id: "projects", label: "Projects", href: "/projects", icon: <FolderIcon /> }}
 *   isExpanded={true}
 * />
 */
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronRightIcon } from "lucide-react";
import { memo, useState } from "react";
import { cn } from "@cognix/ui";
import type { NavItem } from "../../types/index.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SidebarItemProps {
  item: NavItem;
  /** Whether the sidebar is in expanded mode (not collapsed or hover-expanded). */
  isExpanded: boolean;
  /** Nesting depth — used for sub-item indentation. @default 0 */
  depth?: number;
}

/* ─── Sub-item ───────────────────────────────────────────────────────────── */

function SubItem({
  item,
  isExpanded,
}: {
  item: NavItem;
  isExpanded: boolean;
}) {
  if (!isExpanded) return null;
  return (
    <a
      href={item.href}
      aria-current={item.isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 pl-9 pr-3 py-1.5",
        "text-[var(--text-sm)] rounded-[var(--radius-lg)]",
        "transition-colors duration-[var(--duration-fast)]",
        item.isActive
          ? "text-[var(--color-accent)] bg-[var(--color-accent-subtle)] font-[var(--font-weight-medium)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
      )}
    >
      <span className="truncate">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          aria-label={`${item.badge} items`}
          className="ml-auto text-[var(--text-2xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)]"
        >
          {item.badge}
        </span>
      )}
    </a>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export const SidebarItem = memo(function SidebarItem({
  item,
  isExpanded,
  depth = 0,
}: SidebarItemProps) {
  const [childrenOpen, setChildrenOpen] = useState(
    item.children?.some((c) => c.isActive) ?? false
  );

  const hasChildren = (item.children?.length ?? 0) > 0;
  const isTopLevel = depth === 0;

  const itemContent = (
    <span
      className={cn(
        "flex items-center gap-3 flex-1 min-w-0",
        !isExpanded && isTopLevel && "justify-center"
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "shrink-0 flex items-center justify-center",
          "size-[18px]",
          item.isActive
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)]"
        )}
        aria-hidden
      >
        {item.icon}
      </span>

      {/* Label + badge — hidden when collapsed */}
      {isExpanded && (
        <>
          <span className="flex-1 truncate text-[var(--text-sm)]">
            {item.label}
          </span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              aria-label={`${item.badge} items`}
              className={cn(
                "shrink-0 flex items-center justify-center",
                "min-w-[18px] h-[18px] px-1",
                "rounded-[var(--radius-full)]",
                "text-[var(--text-2xs)] font-[var(--font-weight-medium)]",
                item.isActive
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-active)] text-[var(--color-text-secondary)]"
              )}
            >
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRightIcon
              size={14}
              className={cn(
                "shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-[var(--duration-fast)]",
                childrenOpen && "rotate-90"
              )}
              aria-hidden
            />
          )}
        </>
      )}
    </span>
  );

  const linkClass = cn(
    "flex items-center",
    "rounded-[var(--radius-lg)]",
    "transition-colors duration-[var(--duration-fast)]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-inset",
    isExpanded ? "px-3 py-2" : "px-0 py-2 w-full justify-center",
    item.isActive
      ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
  );

  const node = hasChildren ? (
    <button
      type="button"
      aria-expanded={childrenOpen}
      aria-current={item.isActive ? "page" : undefined}
      onClick={() => setChildrenOpen((o) => !o)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setChildrenOpen(true);
        if (e.key === "ArrowLeft") setChildrenOpen(false);
      }}
      className={cn(linkClass, "w-full text-left")}
    >
      {itemContent}
    </button>
  ) : (
    <a
      href={item.href}
      aria-current={item.isActive ? "page" : undefined}
      className={linkClass}
    >
      {itemContent}
    </a>
  );

  const wrappedNode =
    !isExpanded && isTopLevel ? (
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{node}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={8}
              className={cn(
                "z-[var(--z-tooltip)]",
                "px-2.5 py-1.5",
                "rounded-[var(--radius-lg)]",
                "bg-[var(--color-neutral-900)] text-white",
                "text-[var(--text-xs)] font-[var(--font-weight-medium)]",
                "shadow-[var(--shadow-md)]",
                "animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              )}
            >
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-1.5 text-[var(--color-neutral-400)]">
                  {item.badge}
                </span>
              )}
              <Tooltip.Arrow className="fill-[var(--color-neutral-900)]" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    ) : (
      node
    );

  return (
    <li>
      {wrappedNode}
      {/* Nested children */}
      {hasChildren && isExpanded && childrenOpen && (
        <ul className="mt-0.5 space-y-0.5" role="group" aria-label={`${item.label} sub-navigation`}>
          {item.children?.map((child) => (
            <SubItem key={child.id} item={child} isExpanded={isExpanded} />
          ))}
        </ul>
      )}
    </li>
  );
});

SidebarItem.displayName = "SidebarItem";
