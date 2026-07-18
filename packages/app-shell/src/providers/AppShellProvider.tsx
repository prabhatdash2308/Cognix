/**
 * AppShellProvider — the single context for the entire application shell.
 *
 * Composes:
 *   - Sidebar state (via useSidebar)
 *   - Command Palette state (via useCommandPalette)
 *   - Responsive state
 *   - Navigation data, workspace data, user data
 *
 * @example
 * <AppShellProvider
 *   nav={navSections}
 *   currentWorkspace={workspace}
 *   workspaces={allWorkspaces}
 *   user={currentUser}
 *   commandGroups={commandGroups}
 * >
 *   <AppLayout />
 * </AppShellProvider>
 */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useSidebar } from "../hooks/useSidebar.js";
import { useCommandPalette } from "../hooks/useCommandPalette.js";
import type {
  AppShellConfig,
  BreadcrumbItem,
  CommandGroup,
  NavSection,
  NotificationInfo,
  UserInfo,
  WorkspaceInfo,
} from "../types/index.js";

/* ─── Context Types ───────────────────────────────────────────────────────── */

export interface AppShellContextValue {
  // ── Sidebar ──────────────────────────────────────────────────────────────
  sidebar: {
    collapsed: boolean;
    isExpanded: boolean;
    isMobile: boolean;
    hoverExpanded: boolean;
    toggle: () => void;
    collapse: () => void;
    expand: () => void;
    onHoverEnter: () => void;
    onHoverLeave: () => void;
  };

  // ── Command Palette ───────────────────────────────────────────────────────
  commandPalette: {
    isOpen: boolean;
    query: string;
    activeIndex: number;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (q: string) => void;
    navigateUp: () => void;
    navigateDown: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  };

  // ── Mobile navigation ─────────────────────────────────────────────────────
  mobileNav: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  nav: NavSection[];
  currentWorkspace: WorkspaceInfo;
  workspaces: WorkspaceInfo[];
  user: UserInfo;
  commandGroups: CommandGroup[];
  notifications: NotificationInfo;
  breadcrumbs: BreadcrumbItem[];

  // ── Callbacks ─────────────────────────────────────────────────────────────
  onWorkspaceChange: (workspaceId: string) => void;
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}

/* ─── Provider Props ──────────────────────────────────────────────────────── */

export interface AppShellProviderProps {
  children: ReactNode;
  /** Navigation sections rendered in the sidebar. */
  nav: NavSection[];
  /** The currently active workspace. */
  currentWorkspace: WorkspaceInfo;
  /** All available workspaces for the switcher. */
  workspaces: WorkspaceInfo[];
  /** The logged-in user. */
  user: UserInfo;
  /** Command palette items grouped by category. */
  commandGroups?: CommandGroup[];
  /** Notification state. */
  notifications?: NotificationInfo;
  /** Initial breadcrumbs (usually set per-page). */
  initialBreadcrumbs?: BreadcrumbItem[];
  /** Called when the user switches workspace. */
  onWorkspaceChange?: (workspaceId: string) => void;
  /** Shell configuration options. */
  config?: AppShellConfig;
}

/* ─── Context ─────────────────────────────────────────────────────────────── */

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

/* ─── Provider ────────────────────────────────────────────────────────────── */

export function AppShellProvider({
  children,
  nav,
  currentWorkspace,
  workspaces,
  user,
  commandGroups = [],
  notifications = { unreadCount: 0 },
  initialBreadcrumbs = [],
  onWorkspaceChange: onWorkspaceChangeProp,
  config,
}: AppShellProviderProps) {
  const sidebar = useSidebar({
    persist: config?.persistSidebar ?? true,
    storageKey: config?.sidebarStorageKey ?? "cognix-sidebar",
    hoverExpand: config?.hoverExpand ?? true,
  });

  const commandPalette = useCommandPalette();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(initialBreadcrumbs);

  const onWorkspaceChange = useCallback(
    (workspaceId: string) => {
      onWorkspaceChangeProp?.(workspaceId);
    },
    [onWorkspaceChangeProp],
  );

  const value = useMemo<AppShellContextValue>(
    () => ({
      sidebar: {
        collapsed: sidebar.collapsed,
        isExpanded: sidebar.isExpanded,
        isMobile: sidebar.isMobile,
        hoverExpanded: sidebar.hoverExpanded,
        toggle: sidebar.toggle,
        collapse: sidebar.collapse,
        expand: sidebar.expand,
        onHoverEnter: sidebar.onHoverEnter,
        onHoverLeave: sidebar.onHoverLeave,
      },
      commandPalette: {
        isOpen: commandPalette.isOpen,
        query: commandPalette.query,
        activeIndex: commandPalette.activeIndex,
        open: commandPalette.open,
        close: commandPalette.close,
        toggle: commandPalette.toggle,
        setQuery: commandPalette.setQuery,
        navigateUp: commandPalette.navigateUp,
        navigateDown: commandPalette.navigateDown,
        inputRef: commandPalette.inputRef,
      },
      mobileNav: {
        isOpen: mobileNavOpen,
        open: () => setMobileNavOpen(true),
        close: () => setMobileNavOpen(false),
      },
      nav,
      currentWorkspace,
      workspaces,
      user,
      commandGroups,
      notifications,
      breadcrumbs,
      onWorkspaceChange,
      setBreadcrumbs,
    }),
    [
      sidebar.collapsed,
      sidebar.isExpanded,
      sidebar.isMobile,
      sidebar.hoverExpanded,
      sidebar.toggle,
      sidebar.collapse,
      sidebar.expand,
      sidebar.onHoverEnter,
      sidebar.onHoverLeave,
      commandPalette.isOpen,
      commandPalette.query,
      commandPalette.activeIndex,
      commandPalette.open,
      commandPalette.close,
      commandPalette.toggle,
      commandPalette.setQuery,
      commandPalette.navigateUp,
      commandPalette.navigateDown,
      commandPalette.inputRef,
      mobileNavOpen,
      nav,
      currentWorkspace,
      workspaces,
      user,
      commandGroups,
      notifications,
      breadcrumbs,
      onWorkspaceChange,
    ],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

AppShellProvider.displayName = "AppShellProvider";

/* ─── Hook ───────────────────────────────────────────────────────────────── */

/**
 * useAppShell — access the app shell context.
 * Must be used inside an <AppShellProvider>.
 */
export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (ctx === undefined) {
    throw new Error("useAppShell must be used within an <AppShellProvider>.");
  }
  return ctx;
}
