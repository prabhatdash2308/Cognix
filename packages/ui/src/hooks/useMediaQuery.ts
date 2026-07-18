/**
 * useMediaQuery — reactive wrapper around `window.matchMedia`.
 *
 * Returns `true` when the given CSS media query currently matches,
 * and updates reactively whenever the match state changes.
 *
 * SSR-safe: returns `false` on the server and during the first render.
 * Pair with `useMounted` if you need to suppress hydration mismatches.
 *
 * @param query - A valid CSS media query string.
 * @returns `true` if the query currently matches, `false` otherwise.
 *
 * @example
 * import { useMediaQuery } from "@cognix/ui";
 *
 * function Component() {
 *   const isTouch = useMediaQuery("(hover: none) and (pointer: coarse)");
 *   const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
 *   return <div>{isTouch ? "Touch device" : "Pointer device"}</div>;
 * }
 */
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR guard — matchMedia is not available server-side
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    // Sync immediately in case the query changed between renders
    setMatches(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
