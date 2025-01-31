"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useEffect } from "react"
import { fontFamilies, fontSizes } from "@/components/Settings/FontSettings"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useUserSettings();

  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    };

    if (settings?.theme) {
      applyTheme(settings.theme);
    }
    
    if (settings?.font_size) {
      const size = fontSizes[settings.font_size as keyof typeof fontSizes];
      if (size) {
        document.documentElement.style.setProperty('--base-font-size', size.base);
        document.documentElement.style.setProperty('--heading-font-size', size.heading);
      }
    }

    if (settings?.font_family) {
      const font = fontFamilies.find(f => f.id === settings.font_family);
      if (font) {
        document.documentElement.style.setProperty('--font-family', font.value);
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (settings?.theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings?.theme, settings?.font_size, settings?.font_family]);

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