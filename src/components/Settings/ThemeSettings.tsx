import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  }
];

const fontSizes = {
  small: {
    base: "14px",
    heading: "18px"
  },
  medium: {
    base: "16px",
    heading: "20px"
  },
  large: {
    base: "18px",
    heading: "22px"
  }
};

const fontFamilies = [
  { id: "inter", name: "Inter", value: "Inter, sans-serif" },
  { id: "roboto", name: "Roboto", value: "Roboto, sans-serif" },
  { id: "system", name: "Sistem Yazı Tipi", value: "system-ui, sans-serif" }
];

export default function ThemeSettings() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });
  
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("fontFamily") || "system";
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(...themes.map(t => t.class));
    // Add selected theme class
    document.documentElement.classList.add(currentTheme);
    // Save to localStorage
    localStorage.setItem("theme", currentTheme);
    
    // Apply font size
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize as keyof typeof fontSizes].base);
    document.documentElement.style.setProperty('--heading-font-size', fontSizes[fontSize as keyof typeof fontSizes].heading);
    localStorage.setItem("fontSize", fontSize);

    // Apply font family
    const selectedFont = fontFamilies.find(f => f.id === fontFamily);
    if (selectedFont) {
      document.documentElement.style.setProperty('--font-family', selectedFont.value);
      localStorage.setItem("fontFamily", fontFamily);
    }
    
    toast({
      title: "Görünüm ayarları güncellendi",
      description: "Yeni ayarlarınız kaydedildi.",
    });
  }, [currentTheme, fontSize, fontFamily, toast]);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Görünüm Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tema</h3>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Yazı Boyutu</h3>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger>
              <SelectValue placeholder="Yazı boyutu seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Küçük</SelectItem>
              <SelectItem value="medium">Orta</SelectItem>
              <SelectItem value="large">Büyük</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Yazı Tipi</h3>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Yazı tipi seçin" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}