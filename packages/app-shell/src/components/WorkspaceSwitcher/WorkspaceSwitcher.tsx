/**
 * WorkspaceSwitcher — dropdown for switching between workspaces.
 *
 * Built on Radix DropdownMenu. Shows the current workspace icon/initials,
 * name, and a chevron. Dropdown lists recent workspaces and a
 * "Create workspace" action.
 */
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { cn } from "@cognix/ui";
import { useAppShell } from "../../providers/AppShellProvider.js";

/* ─── WorkspaceAvatar helper ─────────────────────────────────────────────── */

function WorkspaceAvatar({
  iconUrl,
  initials,
  name,
  size = "sm",
}: {
  iconUrl?: string;
  initials: string;
  name: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "md" ? "size-6" : "size-5";

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={cn(sizeClass, "rounded-[var(--radius-sm)] object-cover shrink-0")}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        sizeClass,
        "rounded-[var(--radius-sm)] shrink-0",
        "flex items-center justify-center",
        "bg-[var(--color-accent)] text-white",
        "text-[var(--text-2xs)] font-[var(--font-weight-bold)]",
        "leading-none select-none uppercase"
      )}
    >
      {initials.slice(0, 2)}
    </span>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export interface WorkspaceSwitcherProps {
  /** Called when user clicks "Create workspace". */
  onCreateWorkspace?: () => void;
  className?: string;
}

export function WorkspaceSwitcher({
  onCreateWorkspace,
  className,
}: WorkspaceSwitcherProps) {
  const { currentWorkspace, workspaces, onWorkspaceChange } = useAppShell();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Switch workspace"
          className={cn(
            "flex items-center gap-2 min-w-0",
            "h-9 px-2 -mx-2",
            "rounded-[var(--radius-lg)]",
            "hover:bg-[var(--color-surface-hover)]",
            "transition-colors duration-[var(--duration-fast)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
            "group",
            className
          )}
        >
          <WorkspaceAvatar
            {...(currentWorkspace.iconUrl ? { iconUrl: currentWorkspace.iconUrl } : {})}
            initials={currentWorkspace.initials}
            name={currentWorkspace.name}
            size="md"
          />
          <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] truncate max-w-[120px]">
            {currentWorkspace.name}
          </span>
          <ChevronDownIcon
            size={14}
            className="shrink-0 text-[var(--color-text-tertiary)] group-data-[state=open]:rotate-180 transition-transform duration-[var(--duration-fast)]"
            aria-hidden
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className={cn(
            "z-[var(--z-dropdown)] min-w-[220px]",
            "rounded-[var(--radius-xl)]",
            "border border-[var(--color-border)]",
            "bg-[var(--color-surface-raised)]",
            "shadow-[var(--shadow-lg)]",
            "p-1.5",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "origin-[--radix-dropdown-menu-content-transform-origin]"
          )}
        >
          {/* Workspace list */}
          <DropdownMenu.Label className="px-2 py-1 text-[var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-tertiary)] uppercase tracking-[var(--tracking-wider)]">
            Workspaces
          </DropdownMenu.Label>

          {workspaces.map((ws) => {
            const isActive = ws.id === currentWorkspace.id;
            return (
              <DropdownMenu.Item
                key={ws.id}
                onSelect={() => onWorkspaceChange(ws.id)}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2",
                  "rounded-[var(--radius-lg)]",
                  "text-[var(--text-sm)] text-[var(--color-text-primary)]",
                  "cursor-pointer select-none outline-none",
                  "hover:bg-[var(--color-surface-hover)]",
                  "focus:bg-[var(--color-surface-hover)]",
                  "transition-colors duration-[var(--duration-fast)]"
                )}
              >
                <WorkspaceAvatar
                  {...(ws.iconUrl ? { iconUrl: ws.iconUrl } : {})}
                  initials={ws.initials}
                  name={ws.name}
                />
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.plan && (
                  <span className="text-[var(--text-2xs)] text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)]">
                    {ws.plan}
                  </span>
                )}
                {isActive && (
                  <CheckIcon
                    size={14}
                    className="shrink-0 text-[var(--color-accent)]"
                    aria-hidden
                  />
                )}
              </DropdownMenu.Item>
            );
          })}

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

          {/* Create workspace */}
          <DropdownMenu.Item
            {...(onCreateWorkspace ? { onSelect: onCreateWorkspace } : {})}
            className={cn(
              "flex items-center gap-2.5 px-2 py-2",
              "rounded-[var(--radius-lg)]",
              "text-[var(--text-sm)] text-[var(--color-text-secondary)]",
              "cursor-pointer select-none outline-none",
              "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
              "focus:bg-[var(--color-surface-hover)]",
              "transition-colors duration-[var(--duration-fast)]"
            )}
          >
            <span className="flex size-5 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border-strong)]">
              <PlusIcon size={12} aria-hidden />
            </span>
            <span>Create workspace</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

WorkspaceSwitcher.displayName = "WorkspaceSwitcher";
