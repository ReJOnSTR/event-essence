"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
}

const lightTheme: ThemeColors = {
  background: "hsl(0 0% 98%)",
  foreground: "hsl(222.2 84% 4.9%)",
  primary: "hsl(222.2 47.4% 11.2%)",
  secondary: "hsl(210 40% 96.1%)",
  accent: "hsl(210 40% 96.1%)",
  muted: "hsl(210 40% 96.1%)",
}

const darkTheme: ThemeColors = {
  background: "hsl(222.2 84% 2.5%)",
  foreground: "hsl(210 40% 98%)",
  primary: "hsl(210 40% 98%)",
  secondary: "hsl(217.2 32.6% 12%)",
  accent: "hsl(217.2 32.6% 12%)",
  muted: "hsl(217.2 32.6% 12%)",
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const root = window.document.documentElement
    const setThemeColors = (theme: ThemeColors) => {
      for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(`--${key}`, value)
      }
    }

    const updateTheme = () => {
      const isDark = root.classList.contains('dark')
      setThemeColors(isDark ? darkTheme : lightTheme)
    }

    // İlk yükleme
    updateTheme()

    // Tema değişikliklerini dinle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateTheme()
        }
      })
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    })

    setMounted(true)

    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return null
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}