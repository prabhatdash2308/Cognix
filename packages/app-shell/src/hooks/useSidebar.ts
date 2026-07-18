/**
 * useSidebar — manages sidebar collapsed/expanded state.
 *
 * - Persists state to localStorage (opt-out via `persist: false`)
 * - Auto-collapses on narrow viewports (< 768px)
 * - Exposes hover-expand state for "rail" sidebar UX
 */
import { useCallback, useEffect, useState } from "react";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const MOBILE_BREAKPOINT = 768;

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface UseSidebarOptions {
  /** Persist collapsed state to localStorage. @default true */
  persist?: boolean;
  /** localStorage key. @default "cognix-sidebar" */
  storageKey?: string;
  /** Enable hover-to-expand when collapsed. @default true */
  hoverExpand?: boolean;
}

export interface UseSidebarReturn {
  /** Whether the sidebar is currently collapsed. */
  collapsed: boolean;
  /** Whether the sidebar is temporarily expanded by hover while collapsed. */
  hoverExpanded: boolean;
  /** Whether the viewport is considered mobile-width. */
  isMobile: boolean;
  /** The effective "expanded" state accounting for hover. */
  isExpanded: boolean;
  /** Collapse the sidebar. */
  collapse: () => void;
  /** Expand the sidebar. */
  expand: () => void;
  /** Toggle collapse/expand. */
  toggle: () => void;
  /** Called on mouse-enter of sidebar when collapsed + hoverExpand enabled. */
  onHoverEnter: () => void;
  /** Called on mouse-leave of sidebar. */
  onHoverLeave: () => void;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function readStorage(key: string): boolean | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const v = localStorage.getItem(key);
    if (v === "true") return true;
    if (v === "false") return false;
  } catch {
    // blocked storage
  }
  return undefined;
}

function writeStorage(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const { persist = true, storageKey = "cognix-sidebar", hoverExpand = true } = options;

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (persist) {
      const stored = readStorage(storageKey);
      if (stored !== undefined) return stored;
    }
    return false;
  });
  const [hoverExpanded, setHoverExpanded] = useState<boolean>(false);

  // Track viewport width
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (e.matches) {
        setCollapsed(true);
      }
    };

    setIsMobile(mq.matches);
    if (mq.matches) setCollapsed(true);

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    setHoverExpanded(false);
    if (persist) writeStorage(storageKey, true);
  }, [persist, storageKey]);

  const expand = useCallback(() => {
    setCollapsed(false);
    if (persist) writeStorage(storageKey, false);
  }, [persist, storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      if (persist) writeStorage(storageKey, next);
      if (next) setHoverExpanded(false);
      return next;
    });
  }, [persist, storageKey]);

  const onHoverEnter = useCallback(() => {
    if (hoverExpand && collapsed && !isMobile) {
      setHoverExpanded(true);
    }
  }, [hoverExpand, collapsed, isMobile]);

  const onHoverLeave = useCallback(() => {
    setHoverExpanded(false);
  }, []);

  const isExpanded = !collapsed || hoverExpanded;

  return {
    collapsed,
    hoverExpanded,
    isMobile,
    isExpanded,
    collapse,
    expand,
    toggle,
    onHoverEnter,
    onHoverLeave,
  };
}
