import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";

export default function ThemeSettings() {
  const { 
    theme,
    fontSize,
    fontFamily,
    updateTheme,
    updateFontSize,
    updateFontFamily,
    isLoading
  } = useThemeSettings();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Görünüm Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeOptions currentTheme={theme} onThemeChange={updateTheme} />
        <FontSettings 
          fontSize={fontSize}
          onFontSizeChange={updateFontSize}
          fontFamily={fontFamily}
          onFontFamilyChange={updateFontFamily}
        />
      </CardContent>
    </Card>
  );
}