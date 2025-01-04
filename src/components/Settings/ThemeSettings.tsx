import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings, fontSizes, fontFamilies } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light"; // Varsayılan değer "light" olarak değiştirildi
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });
  
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("fontFamily") || "system";
  });
  
  const { toast } = useToast();
  const { applyTheme } = useThemeSettings();

  useEffect(() => {
    const handleSystemThemeChange = () => {
      if (currentTheme === "system") {
        applyTheme("system");
      }
    };

    if (localStorage.getItem("theme") !== currentTheme) {
      applyTheme(currentTheme);
      localStorage.setItem("theme", currentTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [currentTheme, applyTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize as keyof typeof fontSizes].base);
    document.documentElement.style.setProperty('--heading-font-size', fontSizes[fontSize as keyof typeof fontSizes].heading);
    localStorage.setItem("fontSize", fontSize);

    const selectedFont = fontFamilies.find(f => f.id === fontFamily);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-family', selectedFont.value);
      localStorage.setItem("fontFamily", fontFamily);
    }

    toast({
      title: "Görünüm ayarları güncellendi",
      description: "Yeni ayarlarınız kaydedildi.",
    });
  }, [fontSize, fontFamily, toast]);

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