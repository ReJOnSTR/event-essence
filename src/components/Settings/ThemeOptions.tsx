import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const themes = [
  {
    id: "system",
    name: "Sistem Teması",
    class: "system",
    preview: "bg-gradient-to-r from-[#f8fafc] to-[#1A1F2C]",
    description: "Sistem ayarlarına göre otomatik tema"
  },
  {
    id: "light",
    name: "Açık Tema",
    class: "light",
    preview: "bg-[#f8fafc]",
    description: "Klasik açık tema"
  },
  {
    id: "dark",
    name: "Koyu Tema",
    class: "dark",
    preview: "bg-[#1A1F2C]",
    description: "Göz yormayan koyu tema"
  }
];

interface ThemeOptionsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeOptions({ currentTheme, onThemeChange }: ThemeOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tema</h3>
      <RadioGroup
        value={currentTheme}
        onValueChange={onThemeChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {themes.map((theme) => (
          <div 
            key={theme.id} 
            className={cn(
              "relative flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
              currentTheme === theme.id ? "border-primary" : "border-transparent hover:border-muted"
            )}
          >
            <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
            <Label
              htmlFor={theme.id}
              className="flex flex-col gap-2 cursor-pointer w-full"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-md shadow-sm",
                    theme.preview
                  )}
                />
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-muted-foreground">{theme.description}</div>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}