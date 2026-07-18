/**
 * useCommandPalette — manages command palette open state and keyboard navigation.
 *
 * Registers a global Ctrl+K / Cmd+K keyboard shortcut to open/close
 * the palette. Handles arrow-key navigation through items and Escape to close.
 */
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface UseCommandPaletteOptions {
  /** Total number of selectable items for arrow navigation. */
  itemCount?: number;
  /** Called when the user selects an item via Enter key. */
  onSelect?: (index: number) => void;
}

export interface UseCommandPaletteReturn {
  /** Whether the palette is currently open. */
  isOpen: boolean;
  /** The current search query string. */
  query: string;
  /** The currently highlighted item index (-1 = none). */
  activeIndex: number;
  /** Open the palette. */
  open: () => void;
  /** Close the palette and reset query + activeIndex. */
  close: () => void;
  /** Toggle open/close. */
  toggle: () => void;
  /** Update the search query and reset activeIndex to -1. */
  setQuery: (q: string) => void;
  /** Move highlight up one item. */
  navigateUp: () => void;
  /** Move highlight down one item. */
  navigateDown: () => void;
  /** Ref to attach to the search input for auto-focus on open. */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useCommandPalette(
  options: UseCommandPaletteOptions = {}
): UseCommandPaletteReturn {
  const { itemCount = 0, onSelect } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQueryState] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    // Focus the input on next tick after the DOM has rendered
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQueryState("");
    setActiveIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      return !prev;
    });
    if (isOpen) {
      setQueryState("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setActiveIndex(-1);
  }, []);

  const navigateUp = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? itemCount - 1 : prev - 1));
  }, [itemCount]);

  const navigateDown = useCallback(() => {
    setActiveIndex((prev) => (prev >= itemCount - 1 ? 0 : prev + 1));
  }, [itemCount]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            requestAnimationFrame(() => inputRef.current?.focus());
            return true;
          }
          setQueryState("");
          setActiveIndex(-1);
          return false;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Arrow / Escape handling when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          navigateDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateUp();
          break;
        case "Escape":
          close();
          break;
        case "Enter":
          if (activeIndex >= 0 && onSelect) {
            e.preventDefault();
            onSelect(activeIndex);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, navigateDown, navigateUp, close, onSelect]);

  return {
    isOpen,
    query,
    activeIndex,
    open,
    close,
    toggle,
    setQuery,
    navigateUp,
    navigateDown,
    inputRef,
  };
}
