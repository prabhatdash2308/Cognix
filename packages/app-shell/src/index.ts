/**
 * @cognix/app-shell
 *
 * The unified application shell for all Cognix properties.
 * Provides the sidebar, top navigation, command palette, and
 * page structure.
 */

// ─── Types ─────────────────────────────────────────────────────────────────
export * from "./types/index.js";

// ─── Hooks ─────────────────────────────────────────────────────────────────
export * from "./hooks/useSidebar.js";
export * from "./hooks/useCommandPalette.js";

// ─── Providers ─────────────────────────────────────────────────────────────
export * from "./providers/AppShellProvider.js";

// ─── Components ────────────────────────────────────────────────────────────
export * from "./components/Sidebar/Sidebar.js";
export * from "./components/SidebarSection/SidebarSection.js";
export * from "./components/SidebarItem/SidebarItem.js";
export * from "./components/TopBar/TopBar.js";
export * from "./components/Breadcrumbs/Breadcrumbs.js";
export * from "./components/WorkspaceSwitcher/WorkspaceSwitcher.js";
export * from "./components/UserMenu/UserMenu.js";
export * from "./components/NotificationButton/NotificationButton.js";
export * from "./components/SearchButton/SearchButton.js";
export * from "./components/CommandPalette/CommandPalette.js";
export * from "./components/MobileNavigation/MobileNavigation.js";
export * from "./components/PageHeader/PageHeader.js";
