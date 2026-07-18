/**
 * useTheme — access the current theme state and setter.
 *
 * A thin re-export of `useThemeContext` from ThemeProvider,
 * kept as a separate hook file for ergonomic import paths.
 *
 * Must be used inside a <ThemeProvider>.
 *
 * @example
 * import { useTheme } from "@cognix/ui";
 *
 * function ThemeToggle() {
 *   const { resolvedTheme, setTheme } = useTheme();
 *   return (
 *     <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
 *       Toggle theme
 *     </button>
 *   );
 * }
 */
export { useThemeContext as useTheme } from "../providers/ThemeProvider.js";
export type {
  ThemeContextValue,
  ThemePreference,
  ResolvedTheme,
} from "../providers/ThemeProvider.js";
