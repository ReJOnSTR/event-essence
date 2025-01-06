import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings, fontSizes, fontFamilies } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function ThemeSettings() {
  const { session } = useSessionContext();
  const { settings, updateSettings } = useUserSettings();
  const [currentTheme, setCurrentTheme] = useState(settings?.theme || "light");
  const [fontSize, setFontSize] = useState(settings?.font_size || "medium");
  const [fontFamily, setFontFamily] = useState(settings?.font_family || "system");
  const { applyTheme } = useThemeSettings();

  useEffect(() => {
    if (settings) {
      setCurrentTheme(settings.theme);
      setFontSize(settings.font_size);
      setFontFamily(settings.font_family);
    }
  }, [settings]);

  useEffect(() => {
    if (session?.user.id) {
      updateSettings({
        theme: currentTheme,
        font_size: fontSize,
        font_family: fontFamily,
      });
      applyTheme(currentTheme);
    }
  }, [currentTheme, fontSize, fontFamily, session?.user.id]);

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize as keyof typeof fontSizes].base);
    document.documentElement.style.setProperty('--heading-font-size', fontSizes[fontSize as keyof typeof fontSizes].heading);

    const selectedFont = fontFamilies.find(f => f.id === fontFamily);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-family', selectedFont.value);
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