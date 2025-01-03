import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Theme = {
  id: string;
  name: string;
  class: string;
  preview: string;
};

const themes: Theme[] = [
  {
    id: "light",
    name: "Açık Tema",
    class: "light",
    preview: "bg-white"
  },
  {
    id: "dark",
    name: "Koyu Tema",
    class: "dark",
    preview: "bg-[#1A1F2C]"
  },
  {
    id: "nature",
    name: "Doğa",
    class: "nature",
    preview: "bg-gradient-to-r from-[#F2FCE2] to-[#E5DEFF]"
  },
  {
    id: "ocean",
    name: "Okyanus",
    class: "ocean",
    preview: "bg-gradient-to-r from-[#accbee] to-[#e7f0fd]"
  },
  {
    id: "sunset",
    name: "Gün Batımı",
    class: "sunset",
    preview: "bg-gradient-to-r from-[#ee9ca7] to-[#ffdde1]"
  }
];

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const { toast } = useToast();

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(...themes.map(t => t.class));
    // Add selected theme class
    document.documentElement.classList.add(currentTheme);
    // Save to localStorage
    localStorage.setItem("theme", currentTheme);
    
    toast({
      title: "Tema değiştirildi",
      description: `${themes.find(t => t.id === currentTheme)?.name} teması uygulandı.`,
    });
  }, [currentTheme, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={currentTheme}
          onValueChange={setCurrentTheme}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {themes.map((theme) => (
            <div key={theme.id} className="flex items-center space-x-2">
              <RadioGroupItem value={theme.id} id={theme.id} />
              <Label
                htmlFor={theme.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded border",
                    theme.preview
                  )}
                />
                {theme.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}