import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

const themes = [
  {
    id: "system",
    name: "Sistem Teması",
    icon: Monitor,
    class: "system",
    description: "Sistem ayarlarına göre otomatik tema"
  },
  {
    id: "light",
    name: "Açık Tema",
    icon: Sun,
    class: "light",
    description: "Klasik açık tema"
  },
  {
    id: "dark",
    name: "Koyu Tema",
    icon: Moon,
    class: "dark",
    description: "Göz yormayan koyu tema"
  }
];

interface ThemeOptionsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeOptions({ currentTheme, onThemeChange }: ThemeOptionsProps) {
  const [systemTheme, setSystemTheme] = useState<string>(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const getThemePreview = (themeId: string) => {
    if (themeId === "system") {
      return systemTheme === "dark" ? "bg-[#1A1F2C]" : "bg-[#f8fafc]";
    }
    return themeId === "dark" ? "bg-[#1A1F2C]" : "bg-[#f8fafc]";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tema</h3>
      <RadioGroup
        value={currentTheme}
        onValueChange={onThemeChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <div 
              key={theme.id} 
              className={cn(
                "relative flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent",
                currentTheme === theme.id ? "border-primary bg-accent" : "border-transparent hover:border-muted"
              )}
            >
              <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
              <Label
                htmlFor={theme.id}
                className="flex flex-col gap-2 cursor-pointer w-full"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-md shadow-sm flex items-center justify-center",
                      getThemePreview(theme.id)
                    )}
                  >
                    <Icon className={cn(
                      "w-6 h-6",
                      theme.id === "system" ? "text-primary" : 
                      theme.id === "dark" ? "text-white" : "text-black"
                    )} />
                  </div>
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
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}