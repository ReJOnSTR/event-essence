import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings, fontSizes, fontFamilies } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
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
      toast({
        title: "Görünüm ayarları güncellendi",
        description: "Yeni ayarlarınız kaydedildi.",
      });
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [currentTheme, applyTheme, toast]);

  useEffect(() => {
    const currentBaseFontSize = document.documentElement.style.getPropertyValue('--base-font-size');
    const currentHeadingFontSize = document.documentElement.style.getPropertyValue('--heading-font-size');
    const currentFontFamily = document.documentElement.style.getPropertyValue('--font-family');

    const newBaseFontSize = fontSizes[fontSize as keyof typeof fontSizes].base;
    const newHeadingFontSize = fontSizes[fontSize as keyof typeof fontSizes].heading;
    const newFontFamily = fontFamilies.find(f => f.id === fontFamily)?.value;

    if (
      currentBaseFontSize !== newBaseFontSize ||
      currentHeadingFontSize !== newHeadingFontSize ||
      currentFontFamily !== newFontFamily
    ) {
      document.documentElement.style.setProperty('--base-font-size', newBaseFontSize);
      document.documentElement.style.setProperty('--heading-font-size', newHeadingFontSize);
      
      if (newFontFamily) {
        document.documentElement.style.setProperty('--font-family', newFontFamily);
      }
      
      localStorage.setItem("fontSize", fontSize);
      localStorage.setItem("fontFamily", fontFamily);

      toast({
        title: "Görünüm ayarları güncellendi",
        description: "Yeni ayarlarınız kaydedildi.",
      });
    }
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