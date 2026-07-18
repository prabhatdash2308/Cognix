/**
 * PageHeader — standard header for application pages.
 *
 * Renders a title, optional description, and a slot for actions.
 * Can optionally include a divider.
 *
 * @example
 * <PageHeader
 *   title="Projects"
 *   description="Manage all your active projects."
 *   actions={<Button>New Project</Button>}
 *   divided
 * />
 */
import type { ReactNode } from "react";
import { cn } from "@cognix/ui";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface PageHeaderProps {
  /** The main page title (h1) */
  title: ReactNode;
  /** Optional descriptive text below the title */
  description?: ReactNode;
  /** Optional actions (e.g. primary buttons) rendered on the right */
  actions?: ReactNode;
  /** Whether to show a bottom border divider. @default false */
  divided?: boolean;
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
  divided = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        "pb-6",
        divided && "border-b border-[var(--color-border)] mb-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h1 className="text-[var(--text-2xl)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight)] truncate">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

PageHeader.displayName = "PageHeader";
