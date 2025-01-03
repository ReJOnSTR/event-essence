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
  description: string;
};

const themes: Theme[] = [
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
  },
  {
    id: "nature",
    name: "Doğa",
    class: "nature",
    preview: "bg-gradient-to-r from-[#F2FCE2] to-[#E5DEFF]",
    description: "Doğal ve huzur verici yeşil tonları"
  },
  {
    id: "ocean",
    name: "Okyanus",
    class: "ocean",
    preview: "bg-gradient-to-r from-[#accbee] to-[#e7f0fd]",
    description: "Ferahlatıcı mavi tonları"
  },
  {
    id: "sunset",
    name: "Gün Batımı",
    class: "sunset",
    preview: "bg-gradient-to-r from-[#ee9ca7] to-[#ffdde1]",
    description: "Sıcak ve romantik pembe tonları"
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
    <Card className="border shadow-sm">
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
      </CardContent>
    </Card>
  );
}