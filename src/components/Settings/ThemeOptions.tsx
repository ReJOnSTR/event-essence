import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

const themes = [
  {
    id: "system",
    name: "Sistem varsayılanı",
    description: "Sistem ayarlarına göre otomatik tema",
    preview: "bg-gradient-to-r from-[#f8fafc] to-[#1A1F2C]"
  },
  {
    id: "light",
    name: "Açık",
    description: "Klasik açık tema",
    preview: "bg-[#f8fafc]"
  },
  {
    id: "dark",
    name: "Koyu",
    description: "Göz yormayan koyu tema",
    preview: "bg-[#1A1F2C]"
  }
];

interface ThemeOptionsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeOptions({ currentTheme, onThemeChange }: ThemeOptionsProps) {
  const [systemTheme, setSystemTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
      if (currentTheme === "system") {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [currentTheme]);

  const getThemePreview = (themeId: string) => {
    if (themeId === "system") {
      return systemTheme === "dark" ? "bg-[#1A1F2C]" : "bg-[#f8fafc]";
    }
    const theme = themes.find(t => t.id === themeId);
    return theme?.preview || "";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tema</h3>
      <RadioGroup
        value={currentTheme}
        onValueChange={onThemeChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {themes.map((theme) => (
          <Card 
            key={theme.id}
            className={cn(
              "relative flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent",
              currentTheme === theme.id ? "border-primary" : "border-transparent hover:border-muted"
            )}
            onClick={() => onThemeChange(theme.id)}
          >
            <Label
              htmlFor={theme.id}
              className="flex flex-col gap-2 cursor-pointer w-full"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-md shadow-sm",
                    theme.id === "system" ? getThemePreview(theme.id) : theme.preview
                  )}
                />
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {theme.description}
                    {theme.id === "system" && (
                      <span className="ml-1">
                        (Şu an: {systemTheme === "dark" ? "Koyu" : "Açık"})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Label>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}