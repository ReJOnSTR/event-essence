import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings, fontSizes, fontFamilies } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") || "system";
    }
    return "system";
  });
  
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("fontSize") || "medium";
    }
    return "medium";
  });
  
  const [fontFamily, setFontFamily] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("fontFamily") || "system";
    }
    return "system";
  });
  
  const { toast } = useToast();
  const { applyTheme } = useThemeSettings();

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (currentTheme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        applyTheme("system");
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (localStorage.getItem("theme") !== currentTheme) {
      applyTheme(currentTheme);
      localStorage.setItem("theme", currentTheme);
      toast({
        title: "Tema değiştirildi",
        description: "Yeni tema ayarlarınız kaydedildi.",
      });
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [currentTheme, applyTheme, toast]);

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize as keyof typeof fontSizes].base);
    document.documentElement.style.setProperty('--heading-font-size', fontSizes[fontSize as keyof typeof fontSizes].heading);
    localStorage.setItem("fontSize", fontSize);

    const selectedFont = fontFamilies.find(f => f.id === fontFamily);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-family', selectedFont.value);
      localStorage.setItem("fontFamily", fontFamily);
    }
  }, [fontSize, fontFamily]);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Görünüm Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeOptions currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        <FontSettings 
          fontSize={fontSize} 
          onFontSizeChange={setFontSize}
          fontFamily={fontFamily}
          onFontFamilyChange={setFontFamily}
        />
      </CardContent>
    </Card>
  );
}