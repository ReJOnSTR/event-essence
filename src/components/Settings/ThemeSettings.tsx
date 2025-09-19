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
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Tema Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeOptions currentTheme={theme} onThemeChange={updateTheme} />
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Yazı Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
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