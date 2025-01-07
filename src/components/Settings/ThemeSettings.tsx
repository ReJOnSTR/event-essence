import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings, fontSizes, fontFamilies } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";
import { useSettings } from "@/hooks/useSettings";

interface ThemeSettingsData {
  theme: string;
  fontSize: string;
  fontFamily: string;
}

export default function ThemeSettings() {
  const { setting, saveSetting, isLoading } = useSettings('theme');
  const [currentTheme, setCurrentTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("system");
  const { applyTheme } = useThemeSettings();

  useEffect(() => {
    if (setting) {
      setCurrentTheme(setting.theme);
      setFontSize(setting.fontSize);
      setFontFamily(setting.fontFamily);
      applyTheme(setting.theme);
    }
  }, [setting, applyTheme]);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    saveSetting({
      theme,
      fontSize,
      fontFamily
    });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    document.documentElement.style.setProperty('--base-font-size', fontSizes[size as keyof typeof fontSizes].base);
    document.documentElement.style.setProperty('--heading-font-size', fontSizes[size as keyof typeof fontSizes].heading);
    saveSetting({
      theme: currentTheme,
      fontSize: size,
      fontFamily
    });
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    const selectedFont = fontFamilies.find(f => f.id === family);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-family', selectedFont.value);
    }
    saveSetting({
      theme: currentTheme,
      fontSize,
      fontFamily: family
    });
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Görünüm Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeOptions currentTheme={currentTheme} onThemeChange={handleThemeChange} />
        <FontSettings 
          fontSize={fontSize} 
          onFontSizeChange={handleFontSizeChange}
          fontFamily={fontFamily}
          onFontFamilyChange={handleFontFamilyChange}
        />
      </CardContent>
    </Card>
  );
}