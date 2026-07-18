/**
 * Breadcrumbs — accessible breadcrumb trail.
 *
 * Renders an ordered list of BreadcrumbItems separated by a chevron.
 * The last item is non-interactive (current page) and carries aria-current="page".
 *
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Projects", href: "/projects" },
 *     { label: "Cognix Web" },
 *   ]}
 * />
 */
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import type { BreadcrumbItem } from "../../types/index.js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface BreadcrumbsProps {
  /** Ordered list of breadcrumb segments. Last item = current page. */
  items: BreadcrumbItem[];
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex items-center gap-1 text-[var(--text-sm)] min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1 min-w-0"
            >
              {isLast ? (
                <span
                  className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)] truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={cn(
                        "text-[var(--color-text-secondary)]",
                        "hover:text-[var(--color-text-primary)]",
                        "transition-colors duration-[var(--duration-fast)]",
                        "truncate max-w-[160px]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-[var(--radius-sm)]"
                      )}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-[var(--color-text-secondary)] truncate max-w-[160px]">
                      {item.label}
                    </span>
                  )}
                  <ChevronRightIcon
                    size={14}
                    className="shrink-0 text-[var(--color-text-tertiary)]"
                    aria-hidden
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.displayName = "Breadcrumbs";
