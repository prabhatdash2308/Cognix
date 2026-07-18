
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "../../utils/cn.js";
import type { ModalProps, ModalSize } from "./Modal.types.js";

/* ─── Close icon SVG ────────────────────────────────────────────────────── */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ─── Size map ──────────────────────────────────────────────────────────── */
const sizeStyles: Record<ModalSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

/**
 * Modal — accessible dialog built on Radix Dialog.
 *
 * @example
 * <Modal
 *   trigger={<Button>Open</Button>}
 *   title="Confirm Action"
 *   description="This action cannot be undone."
 *   footer={<><Button variant="ghost">Cancel</Button><Button variant="destructive">Delete</Button></>}
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  hideCloseButton = false,
}: ModalProps) {
  return (
    <RadixDialog.Root
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      {trigger && (
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      )}

      <RadixDialog.Portal>
        {/* Overlay */}
        <RadixDialog.Overlay
          className={cn(
            "fixed inset-0",
            "z-[var(--z-overlay)]",
            "bg-black/60 backdrop-blur-[2px]",
            "data-[state=open]:animate-[fadeIn_var(--duration-fast)_var(--ease-out)]",
            "data-[state=closed]:animate-[fadeOut_var(--duration-fast)_var(--ease-in)]"
          )}
        />

        {/* Content */}
        <RadixDialog.Content
          className={cn(
            // Position
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "z-[var(--z-modal)]",
            // Layout
            "w-[calc(100vw-2rem)]",
            sizeStyles[size],
            "max-h-[85vh]",
            "flex flex-col",
            // Visual
            "bg-[var(--color-surface)]",
            "border border-[var(--color-border)]",
            "rounded-[var(--radius-2xl)]",
            "shadow-[var(--shadow-2xl)]",
            // Animation
            "data-[state=open]:animate-[dialogIn_var(--duration-normal)_var(--ease-spring)]",
            "data-[state=closed]:animate-[dialogOut_var(--duration-fast)_var(--ease-in)]",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--color-border)] shrink-0">
            <div className="flex flex-col gap-1">
              <RadixDialog.Title
                className={cn(
                  "text-[var(--text-lg)] font-[var(--font-weight-semibold)]",
                  "text-[var(--color-text-primary)] leading-tight"
                )}
              >
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description
                  className={cn(
                    "text-[var(--text-sm)] text-[var(--color-text-secondary)]"
                  )}
                >
                  {description}
                </RadixDialog.Description>
              )}
            </div>

            {!hideCloseButton && (
              <RadixDialog.Close
                className={cn(
                  "shrink-0 rounded-[var(--radius-md)] p-1",
                  "text-[var(--color-text-tertiary)]",
                  "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-border-focus)]"
                )}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </RadixDialog.Close>
            )}
          </div>

          {/* Body */}
          {children && (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)] shrink-0">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

Modal.displayName = "Modal";

/** Convenience re-exports for headless composition */
export const ModalRoot = RadixDialog.Root;
export const ModalTrigger = RadixDialog.Trigger;
export const ModalClose = RadixDialog.Close;
