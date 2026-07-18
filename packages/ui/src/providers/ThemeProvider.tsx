/**
 * ThemeProvider — manages light / dark / system theme for the Cognix UI.
 *
 * Strategy:
 *   - The current resolved theme ("light" | "dark") is applied as
 *     `data-theme="light"` or `data-theme="dark"` on the <html> element.
 *   - "system" reads `prefers-color-scheme` and tracks changes in real time.
 *   - Preference is persisted to `localStorage` under the key
 *     `"cognix-theme"` so it survives page refreshes.
 *   - A script injected into the <head> (see ThemeScript) eliminates
 *     flash-of-wrong-theme (FOWT) for SSR / Next.js applications.
 *
 * Usage:
 *   // Wrap your app once:
 *   <ThemeProvider defaultTheme="system">
 *     <App />
 *   </ThemeProvider>
 *
 *   // Consume anywhere:
 *   const { theme, resolvedTheme, setTheme } = useTheme();
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

/** The three user-selectable theme preferences */
export type ThemePreference = "light" | "dark" | "system";

/** The actual applied theme — always resolved to a concrete value */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  /** The raw user preference (may be "system") */
  theme: ThemePreference;
  /** The actual resolved theme applied to the document */
  resolvedTheme: ResolvedTheme;
  /** Update the stored preference and apply it immediately */
  setTheme: (theme: ThemePreference) => void;
  /** List of themes available for the selector UI */
  themes: ThemePreference[];
}

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * The theme to use if no preference has been stored yet.
   * @default "system"
   */
  defaultTheme?: ThemePreference;
  /**
   * localStorage key used to persist the preference.
   * @default "cognix-theme"
   */
  storageKey?: string;
}

/* ─── Constants ─────────────────────────────────────────────────────────── */

const STORAGE_KEY_DEFAULT = "cognix-theme";
const THEMES: ThemePreference[] = ["light", "dark", "system"];
const HTML_ATTR = "data-theme";

/* ─── Context ────────────────────────────────────────────────────────────── */

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(key: string): ThemePreference | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(key);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // localStorage may be blocked in private browsing
  }
  return undefined;
}

function storeTheme(key: string, theme: ThemePreference): void {
  try {
    localStorage.setItem(key, theme);
  } catch {
    // ignore write errors
  }
}

function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(HTML_ATTR, resolved);
}

/* ─── Provider ───────────────────────────────────────────────────────────── */

/**
 * ThemeProvider — wrap your application root with this component.
 *
 * @example
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY_DEFAULT,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    return getStoredTheme(storageKey) ?? defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Track system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Apply to <html> whenever resolved theme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      storeTheme(storageKey, next);
      setThemeState(next);
    },
    [storageKey]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, themes: THEMES }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.displayName = "ThemeProvider";

/* ─── Hook ───────────────────────────────────────────────────────────────── */

/**
 * useTheme — access and control the active theme.
 *
 * Must be used inside a <ThemeProvider>.
 *
 * @example
 * const { resolvedTheme, setTheme } = useTheme();
 * <button onClick={() => setTheme("dark")}>Dark mode</button>
 */
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useThemeContext must be used within a <ThemeProvider>.");
  }
  return ctx;
}

/* ─── ThemeScript (FOWT prevention for SSR) ─────────────────────────────── */

/**
 * ThemeScript — inject into your document <head> to prevent
 * flash-of-wrong-theme (FOWT) in SSR setups (Next.js, Remix, etc.).
 *
 * The script reads localStorage synchronously before React hydrates,
 * and sets `data-theme` on <html> immediately.
 *
 * @example
 * // app/layout.tsx (Next.js App Router)
 * import { ThemeScript } from "@cognix/ui";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         <ThemeScript storageKey="cognix-theme" defaultTheme="system" />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 */
export interface ThemeScriptProps {
  storageKey?: string;
  defaultTheme?: ThemePreference;
}

export function ThemeScript({
  storageKey = STORAGE_KEY_DEFAULT,
  defaultTheme = "system",
}: ThemeScriptProps) {
  const script = `
(function() {
  try {
    var stored = localStorage.getItem(${JSON.stringify(storageKey)});
    var valid = ['light','dark','system'];
    var theme = valid.indexOf(stored) !== -1 ? stored : ${JSON.stringify(defaultTheme)};
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch(e) {}
})();
`.trim();

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional FOWT-prevention inline script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

ThemeScript.displayName = "ThemeScript";
