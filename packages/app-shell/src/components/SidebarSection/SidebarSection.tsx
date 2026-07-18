/**
 * SidebarSection — a labelled group of navigation items.
 *
 * Section label is hidden when the sidebar is in collapsed (icon-only) mode.
 * Renders a <ul> list of SidebarItems.
 */
import { cn } from "@cognix/ui";
import { SidebarItem } from "../SidebarItem/SidebarItem.js";
import type { NavSection } from "../../types/index.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SidebarSectionProps {
  section: NavSection;
  /** Whether the sidebar is in its expanded state. */
  isExpanded: boolean;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function SidebarSection({ section, isExpanded }: SidebarSectionProps) {
  return (
    <div className="space-y-0.5">
      {section.label && isExpanded && (
        <div
          className={cn(
            "px-3 pb-1 pt-3",
            "text-[var(--text-xs)] font-[var(--font-weight-medium)]",
            "text-[var(--color-text-tertiary)] uppercase tracking-[var(--tracking-wider)]",
            "select-none",
          )}
          aria-hidden
        >
          {section.label}
        </div>
      )}
      <ul className="space-y-0.5" role="list" aria-label={section.label ?? "Navigation"}>
        {section.items.map((item) => (
          <SidebarItem key={item.id} item={item} isExpanded={isExpanded} />
        ))}
      </ul>
    </div>
  );
}

SidebarSection.displayName = "SidebarSection";
