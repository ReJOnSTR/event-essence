"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useUserSettings();

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  }, [settings?.theme]);

  return (
    <NextThemesProvider 
      {...props}
      defaultTheme={settings?.theme || "system"}
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}