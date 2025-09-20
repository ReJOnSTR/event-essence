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
    <div className="space-y-4 w-full max-w-full">
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg">Tema Seçimi</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ThemeOptions currentTheme={theme} onThemeChange={updateTheme} />
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg">Yazı Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <FontSettings 
            fontSize={fontSize}
            onFontSizeChange={updateFontSize}
            fontFamily={fontFamily}
            onFontFamilyChange={updateFontFamily}
          />
        </CardContent>
      </Card>
    </div>
  );
}