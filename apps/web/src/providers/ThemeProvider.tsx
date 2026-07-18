"use client";

import { ThemeProvider as UIThemeProvider } from "@cognix/ui";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

export function ThemeProvider(props: ThemeProviderProps) {
  return <UIThemeProvider {...props} />;
}
