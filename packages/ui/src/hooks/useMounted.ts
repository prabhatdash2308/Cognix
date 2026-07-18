/**
 * useMounted — returns true only after the component has mounted on the client.
 *
 * Solves the SSR hydration mismatch problem: during SSR and the first
 * render on the client, `mounted` is `false`. After the first effect fires,
 * `mounted` becomes `true`.
 *
 * Use this to gate any browser-only rendering (theme-dependent UI,
 * window-size-dependent layouts, etc.).
 *
 * @returns `true` if the component is mounted client-side, `false` otherwise.
 *
 * @example
 * import { useMounted } from "@cognix/ui";
 *
 * function ThemeIcon() {
 *   const mounted = useMounted();
 *   const { resolvedTheme } = useTheme();
 *
 *   if (!mounted) return <span className="w-5 h-5" />; // placeholder with same size
 *
 *   return resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />;
 * }
 */
import { useEffect, useState } from "react";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
