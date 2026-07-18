/**
 * CommandPalette — global search and quick-action overlay.
 *
 * Built on Radix Dialog for proper focus trapping and accessibility.
 * Opens via Ctrl+K / Cmd+K (handled by useCommandPalette hook).
 *
 * Features:
 * - Search input at the top
 * - Filtered command groups
 * - Keyboard navigation (ArrowUp/Down, Enter to select, Escape to close)
 * - Shortcut badges per item
 * - Empty state
 */
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";
import type { CommandItem, CommandGroup } from "../../types/index.js";

/* ─── Filtered groups helper ─────────────────────────────────────────────── */

function filterGroups(groups: CommandGroup[], query: string): CommandGroup[] {
  if (!query.trim()) return groups;
  const q = query.toLowerCase();
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length > 0);
}

/* ─── CommandItemRow ─────────────────────────────────────────────────────── */

function CommandItemRow({
  item,
  isActive,
  onSelect,
}: {
  item: CommandItem;
  isActive: boolean;
  onSelect: (item: CommandItem) => void;
}) {
  return (
    <button
      type="button"
      id={`cmd-item-${item.id}`}
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(item)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5",
        "rounded-[var(--radius-lg)]",
        "text-left cursor-pointer",
        "transition-colors duration-[var(--duration-fast)]",
        "focus:outline-none",
        isActive
          ? "bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]"
          : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
      )}
    >
      {item.icon && (
        <span className="shrink-0 text-[var(--color-text-secondary)]" aria-hidden>
          {item.icon}
        </span>
      )}

      <span className="flex-1 min-w-0">
        <span className="block text-[var(--text-sm)] font-[var(--font-weight-medium)] truncate">
          {item.label}
        </span>
        {item.description && (
          <span className="block text-[var(--text-xs)] text-[var(--color-text-secondary)] truncate mt-0.5">
            {item.description}
          </span>
        )}
      </span>

      {item.shortcut && item.shortcut.length > 0 && (
        <span className="flex items-center gap-0.5 shrink-0" aria-hidden>
          {item.shortcut.map((key, i) => (
            <kbd
              key={i}
              className={cn(
                "flex items-center justify-center",
                "min-w-[20px] h-5 px-1",
                "rounded-[var(--radius-sm)]",
                "border border-[var(--color-border)]",
                "bg-[var(--color-surface)]",
                "text-[var(--text-2xs)] font-[var(--font-weight-medium)]",
                "text-[var(--color-text-tertiary)] leading-none",
              )}
            >
              {key}
            </kbd>
          ))}
        </span>
      )}
    </button>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export interface CommandPaletteProps {
  className?: string;
}

export function CommandPalette({ className }: CommandPaletteProps) {
  const { commandPalette, commandGroups } = useAppShell();
  const { isOpen, query, activeIndex, close, setQuery, inputRef } = commandPalette;

  // Build flat list for index mapping
  const filteredGroups = useMemo(() => filterGroups(commandGroups, query), [commandGroups, query]);

  const flatItems = useMemo(() => filteredGroups.flatMap((g) => g.items), [filteredGroups]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      item.onSelect();
      close();
    },
    [close],
  );

  // Map flat index to item
  let flatIndex = 0;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[var(--z-modal)]",
            "bg-black/50 backdrop-blur-sm",
            "animate-in fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-[20%] -translate-x-1/2",
            "z-[var(--z-modal)] w-full max-w-[560px] mx-auto px-4",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className,
          )}
          aria-label="Command palette"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              commandPalette.navigateDown();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              commandPalette.navigateUp();
            } else if (e.key === "Enter" && activeIndex >= 0) {
              e.preventDefault();
              const item = flatItems[activeIndex];
              if (item) handleSelect(item);
            }
          }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Command Palette</Dialog.Title>
          </VisuallyHidden.Root>

          <div
            className={cn(
              "rounded-[var(--radius-2xl)]",
              "border border-[var(--color-border)]",
              "bg-[var(--color-surface-raised)]",
              "shadow-[var(--shadow-2xl)]",
              "overflow-hidden",
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-[var(--color-border)]">
              <SearchIcon
                size={18}
                className="shrink-0 text-[var(--color-text-tertiary)]"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls="cmd-results"
                aria-activedescendant={
                  activeIndex >= 0 ? `cmd-item-${flatItems[activeIndex]?.id ?? ""}` : undefined
                }
                placeholder="Search commands…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  "flex-1 h-12 bg-transparent",
                  "text-[var(--text-base)] text-[var(--color-text-primary)]",
                  "placeholder:text-[var(--color-text-tertiary)]",
                  "outline-none border-0 ring-0",
                )}
              />
              <kbd
                className={cn(
                  "hidden sm:flex items-center justify-center",
                  "h-6 px-2",
                  "rounded-[var(--radius-md)]",
                  "border border-[var(--color-border)]",
                  "bg-[var(--color-surface)]",
                  "text-[var(--text-xs)] text-[var(--color-text-tertiary)]",
                )}
                aria-hidden
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div
              id="cmd-results"
              role="listbox"
              aria-label="Command results"
              className="max-h-[360px] overflow-y-auto p-2"
            >
              {filteredGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-tertiary)]">
                  <SearchIcon size={24} className="mb-3 opacity-40" aria-hidden />
                  <p className="text-[var(--text-sm)]">No results found</p>
                  <p className="text-[var(--text-xs)] mt-1">Try a different search term</p>
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.label} className="mb-2 last:mb-0">
                    <div className="px-2 pb-1 text-[var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)] uppercase tracking-[var(--tracking-wider)]">
                      {group.label}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const itemIdx = flatIndex++;
                        return (
                          <CommandItemRow
                            key={item.id}
                            item={item}
                            isActive={activeIndex === itemIdx}
                            onSelect={handleSelect}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-[var(--color-border)] px-4 py-2 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <kbd
                  className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--text-2xs)]"
                  aria-hidden
                >
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <kbd
                  className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--text-2xs)]"
                  aria-hidden
                >
                  ↵
                </kbd>
                Select
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
                <kbd
                  className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--text-2xs)]"
                  aria-hidden
                >
                  Esc
                </kbd>
                Close
              </span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

CommandPalette.displayName = "CommandPalette";
