import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "../../utils/cn.js";
import type {
  DropdownCheckboxItem,
  DropdownItemBase,
  DropdownMenuItem,
  DropdownProps,
} from "./Dropdown.types.js";

/* ─── Shared item styles ────────────────────────────────────────────────── */
const itemBase = [
  "relative flex items-center gap-2",
  "px-2.5 py-1.5 rounded-[var(--radius-md)]",
  "text-[var(--text-sm)] text-[var(--color-text-primary)]",
  "cursor-default select-none outline-none",
  "transition-colors duration-[var(--duration-fast)]",
  "data-[highlighted]:bg-[var(--color-surface-hover)]",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
].join(" ");

/* ─── Check icon ────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden
    >
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

/* ─── Item renderers ────────────────────────────────────────────────────── */
function renderItem(item: DropdownMenuItem, idx: number): React.ReactNode {
  if (item.type === "separator") {
    return <RadixDropdown.Separator key={idx} className="my-1 h-px bg-[var(--color-border)]" />;
  }

  if (item.type === "label") {
    return (
      <RadixDropdown.Label
        key={idx}
        className="px-2.5 py-1 text-[var(--text-2xs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-tertiary)]"
      >
        {item.label}
      </RadixDropdown.Label>
    );
  }

  if (item.type === "checkbox") {
    const cbItem = item as DropdownCheckboxItem;
    return (
      <RadixDropdown.CheckboxItem
        key={idx}
        checked={cbItem.checked}
        onCheckedChange={cbItem.onCheckedChange}
        disabled={cbItem.disabled ?? false}
        className={itemBase}
      >
        <RadixDropdown.ItemIndicator className="flex h-3 w-3 items-center justify-center text-[var(--color-accent)]">
          <CheckIcon />
        </RadixDropdown.ItemIndicator>
        {cbItem.label}
      </RadixDropdown.CheckboxItem>
    );
  }

  // Default item
  const defItem = item as DropdownItemBase;
  return (
    <RadixDropdown.Item
      key={idx}
      disabled={defItem.disabled ?? false}
      {...(defItem.onSelect ? { onSelect: () => defItem.onSelect && defItem.onSelect() } : {})}
      className={cn(
        itemBase,
        defItem.destructive &&
          "text-[var(--color-error)] data-[highlighted]:bg-[oklch(0.638_0.208_20_/_0.12)]",
      )}
    >
      {defItem.icon && (
        <span className="shrink-0 text-[var(--color-text-tertiary)]" aria-hidden>
          {defItem.icon}
        </span>
      )}
      <span className="flex-1">{defItem.label}</span>
      {defItem.shortcut && (
        <span className="ml-auto text-[var(--text-2xs)] text-[var(--color-text-tertiary)] font-[var(--font-weight-medium)]">
          {defItem.shortcut}
        </span>
      )}
    </RadixDropdown.Item>
  );
}

/**
 * Dropdown — accessible context menu / action menu built on Radix.
 *
 * @example
 * <Dropdown
 *   trigger={<Button variant="ghost">Options</Button>}
 *   items={[
 *     { label: "Edit", icon: <PencilIcon />, onSelect: () => {} },
 *     { type: "separator" },
 *     { label: "Delete", destructive: true, onSelect: () => {} },
 *   ]}
 * />
 */
export function Dropdown({
  trigger,
  items,
  align = "start",
  side = "bottom",
  open,
  defaultOpen,
  onOpenChange,
}: DropdownProps) {
  return (
    <RadixDropdown.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            "z-[var(--z-dropdown)]",
            "min-w-[180px] max-w-[280px]",
            "rounded-[var(--radius-xl)]",
            "bg-[var(--color-surface-raised)]",
            "border border-[var(--color-border)]",
            "shadow-[var(--shadow-xl)]",
            "p-1.5",
            "overflow-hidden",
            // Animation
            "data-[state=open]:animate-[dropdownIn_var(--duration-fast)_var(--ease-out)]",
            "data-[state=closed]:animate-[dropdownOut_var(--duration-fast)_var(--ease-in)]",
            "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
            "will-change-[transform,opacity]",
          )}
        >
          {items.map((item, idx) => renderItem(item, idx))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

Dropdown.displayName = "Dropdown";
