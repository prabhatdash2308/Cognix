
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn.js";
import type { TabsOrientation, TabsProps, TabsVariant } from "./Tabs.types.js";

/* ─── List variant styles ───────────────────────────────────────────────── */
const listVariants: Record<
  TabsVariant,
  Record<TabsOrientation, string>
> = {
  line: {
    horizontal: "border-b border-[var(--color-border)] gap-6",
    vertical: "border-r border-[var(--color-border)] gap-2 flex-col",
  },
  pill: {
    horizontal: "gap-2",
    vertical: "gap-2 flex-col",
  },
  enclosed: {
    horizontal: "bg-[var(--color-surface-raised)] p-1 rounded-[var(--radius-lg)] border border-[var(--color-border)]",
    vertical: "bg-[var(--color-surface-raised)] p-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex-col",
  },
};

/* ─── Trigger variant styles ────────────────────────────────────────────── */
const triggerVariants: Record<
  TabsVariant,
  Record<TabsOrientation, string>
> = {
  line: {
    horizontal: [
      "border-b-2 border-transparent pb-2 mb-[-1px]",
      "data-[state=active]:border-[var(--color-border-focus)] data-[state=active]:text-[var(--color-text-primary)]",
    ].join(" "),
    vertical: [
      "border-r-2 border-transparent pr-4 mr-[-1px] py-1.5 w-full justify-start",
      "data-[state=active]:border-[var(--color-border-focus)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:bg-[var(--color-surface-hover)]",
    ].join(" "),
  },
  pill: {
    horizontal: [
      "px-3 py-1.5 rounded-[var(--radius-full)]",
      "data-[state=active]:bg-[var(--color-surface-active)] data-[state=active]:text-[var(--color-text-primary)]",
    ].join(" "),
    vertical: [
      "px-3 py-1.5 rounded-[var(--radius-full)] w-full justify-start",
      "data-[state=active]:bg-[var(--color-surface-active)] data-[state=active]:text-[var(--color-text-primary)]",
    ].join(" "),
  },
  enclosed: {
    horizontal: [
      "px-3 py-1.5 rounded-[var(--radius-md)] flex-1",
      "data-[state=active]:bg-[var(--color-bg-base)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-[var(--shadow-sm)]",
    ].join(" "),
    vertical: [
      "px-3 py-1.5 rounded-[var(--radius-md)] w-full justify-start",
      "data-[state=active]:bg-[var(--color-bg-base)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-[var(--shadow-sm)]",
    ].join(" "),
  },
};

/**
 * Tabs — accessible tabbed content based on Radix.
 *
 * @example
 * <Tabs
 *   variant="line"
 *   defaultValue="tab1"
 *   items={[
 *     { value: "tab1", label: "Account", content: <div>Account settings</div> },
 *     { value: "tab2", label: "Password", content: <div>Password form</div> },
 *   ]}
 * />
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "line",
  orientation = "horizontal",
  fullWidth = false,
}: TabsProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <RadixTabs.Root
      {...(value !== undefined ? { value } : {})}
      {...((defaultValue ?? items[0]?.value) ? { defaultValue: (defaultValue ?? items[0]?.value) as string } : {})}
      {...(onValueChange !== undefined ? { onValueChange } : {})}
      orientation={orientation}
      className={cn(
        "flex",
        isHorizontal ? "flex-col" : "flex-row gap-6",
        fullWidth && "w-full"
      )}
    >
      <RadixTabs.List
        className={cn(
          "flex shrink-0",
          listVariants[variant][orientation],
          // Hide scrollbar if horizontal overflowing
          isHorizontal && "overflow-x-auto no-scrollbar",
          fullWidth && isHorizontal && variant === "line" && "justify-between"
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "flex items-center justify-center gap-2",
              "text-[var(--text-sm)] font-[var(--font-weight-medium)]",
              "text-[var(--color-text-secondary)]",
              "transition-all duration-[var(--duration-fast)]",
              "hover:text-[var(--color-text-primary)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-border-focus)]",
              "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
              triggerVariants[variant][orientation]
            )}
          >
            {item.icon && (
              <span className="shrink-0" aria-hidden>
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          className={cn(
            "flex-1 outline-none",
            isHorizontal && "mt-4",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:rounded-[var(--radius-sm)]"
          )}
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}

Tabs.displayName = "Tabs";
