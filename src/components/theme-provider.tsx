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
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
    
    // Font size ayarını uygula
    if (settings?.font_size) {
      const size = fontSizes[settings.font_size as keyof typeof fontSizes];
      document.documentElement.style.setProperty('--base-font-size', size.base);
      document.documentElement.style.setProperty('--heading-font-size', size.heading);
    }

    // Font family ayarını uygula
    if (settings?.font_family) {
      const font = fontFamilies.find(f => f.id === settings.font_family);
      if (font) {
        document.documentElement.style.setProperty('--font-family', font.value);
      }
    }
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