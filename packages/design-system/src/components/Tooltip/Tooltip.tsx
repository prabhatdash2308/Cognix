import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../utils/cn.js";
import type { TooltipProps } from "./Tooltip.types.js";

/**
 * Tooltip — accessible hover/focus label for UI elements.
 *
 * Wrap your app with `<TooltipProvider>` once at the root for shared
 * delay configuration; or use the self-contained `<Tooltip>` which
 * includes its own provider.
 *
 * @example
 * <Tooltip content="Copy to clipboard" side="top">
 *   <Button iconOnly><CopyIcon /></Button>
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
  open,
  defaultOpen,
  onOpenChange,
  contentClassName,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              // Layout
              "z-[var(--z-tooltip)]",
              "max-w-[220px] px-3 py-1.5",
              // Visual
              "rounded-[var(--radius-md)]",
              "bg-[var(--color-neutral-800)]",
              "border border-[var(--color-border)]",
              "shadow-[var(--shadow-lg)]",
              // Text
              "text-[var(--text-xs)] text-[var(--color-text-primary)]",
              "font-[var(--font-weight-medium)]",
              "leading-snug",
              // Animation
              "will-change-[transform,opacity]",
              "data-[state=delayed-open]:data-[side=top]:animate-[slideDownAndFade_var(--duration-fast)_var(--ease-out)]",
              "data-[state=delayed-open]:data-[side=bottom]:animate-[slideUpAndFade_var(--duration-fast)_var(--ease-out)]",
              "data-[state=delayed-open]:data-[side=left]:animate-[slideRightAndFade_var(--duration-fast)_var(--ease-out)]",
              "data-[state=delayed-open]:data-[side=right]:animate-[slideLeftAndFade_var(--duration-fast)_var(--ease-out)]",
              contentClassName,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--color-neutral-800)]" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

Tooltip.displayName = "Tooltip";

/** Re-export the provider for app-level wrapping */
export const TooltipProvider = RadixTooltip.Provider;
