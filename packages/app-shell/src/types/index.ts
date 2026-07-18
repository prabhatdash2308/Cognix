/**
 * @cognix/app-shell — Shared types
 *
 * These types are the contract between the AppShellProvider and all
 * shell components. Consumers pass data in this shape and the shell
 * renders accordingly.
 */
import type { ReactNode } from "react";

/* ─── Navigation ──────────────────────────────────────────────────────────── */

export interface NavItem {
  /** Unique identifier used as React key and for active-state matching. */
  id: string;
  /** Display label. Hidden in collapsed sidebar (tooltip shown instead). */
  label: string;
  /** Navigation target. Pass to your router's Link component via asChild. */
  href: string;
  /** Lucide icon or any ReactNode to display alongside the label. */
  icon: ReactNode;
  /** Optional badge count displayed on the item (e.g. unread tasks). */
  badge?: number;
  /** Explicitly marks this item as the active route. */
  isActive?: boolean;
  /** Nested sub-items revealed on expand. */
  children?: NavItem[];
}

export interface NavSection {
  /** Unique identifier. */
  id: string;
  /** Optional section label shown above items. Hidden in collapsed sidebar. */
  label?: string;
  /** Navigation items in this section. */
  items: NavItem[];
}

/* ─── Workspace ───────────────────────────────────────────────────────────── */

export interface WorkspaceInfo {
  /** Unique workspace identifier. */
  id: string;
  /** Workspace display name. */
  name: string;
  /** URL to the workspace's logo image. If absent, `initials` is shown. */
  iconUrl?: string;
  /** 1–2 character fallback initials. */
  initials: string;
  /** Optional plan label shown in the switcher (e.g. "Pro", "Free"). */
  plan?: string;
}

/* ─── User ────────────────────────────────────────────────────────────────── */

export interface UserInfo {
  /** Display name. */
  name: string;
  /** Email address shown below the name in UserMenu. */
  email: string;
  /** URL to the user's avatar image. Falls back to initials if absent. */
  avatarUrl?: string;
}

/* ─── Command Palette ─────────────────────────────────────────────────────── */

export interface CommandItem {
  /** Unique identifier. */
  id: string;
  /** Primary display label. */
  label: string;
  /** Optional subtitle or description. */
  description?: string;
  /** Icon shown to the left of the label. */
  icon?: ReactNode;
  /** Keyboard shortcut displayed to the right (e.g. ["⌘", "K"]). */
  shortcut?: string[];
  /** Callback fired when this item is selected via click or Enter. */
  onSelect: () => void;
}

export interface CommandGroup {
  /** Group header label (e.g. "Recent", "Quick Actions"). */
  label: string;
  /** Items within this group. */
  items: CommandItem[];
}

/* ─── Breadcrumbs ─────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  /** Display label. */
  label: string;
  /** Optional href. If absent, item is rendered as plain text (current page). */
  href?: string;
}

/* ─── Notifications ───────────────────────────────────────────────────────── */

export interface NotificationInfo {
  /** Number of unread notifications. 0 hides the badge. */
  unreadCount: number;
  /** Called when the notification button is clicked. */
  onOpen?: () => void;
}

/* ─── App Shell Config ────────────────────────────────────────────────────── */

export interface AppShellConfig {
  /** Enable sidebar hover-to-expand behaviour when collapsed. @default true */
  hoverExpand?: boolean;
  /** Persist sidebar collapsed state to localStorage. @default true */
  persistSidebar?: boolean;
  /** localStorage key for sidebar state. @default "cognix-sidebar" */
  sidebarStorageKey?: string;
}
