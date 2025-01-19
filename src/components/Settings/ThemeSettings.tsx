import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { FontSettings } from "./FontSettings";
import { ThemeOptions } from "./ThemeOptions";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm animate-fade-in">
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