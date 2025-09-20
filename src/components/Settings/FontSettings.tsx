import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const fontSizes = {
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

export const fontFamilies = [
  { 
    id: "playfair", 
    name: "Playfair Display", 
    value: "'Playfair Display', serif",
    description: "Zarif ve klasik serif yazı tipi"
  },
  { 
    id: "robotomono", 
    name: "Roboto Mono", 
    value: "'Roboto Mono', monospace",
    description: "Modern monospace yazı tipi"
  },
  { 
    id: "abrilfatface", 
    name: "Abril Fatface", 
    value: "'Abril Fatface', cursive",
    description: "Dekoratif display yazı tipi"
  },
  { 
    id: "comfortaa", 
    name: "Comfortaa", 
    value: "'Comfortaa', cursive",
    description: "Yumuşak köşeli modern yazı tipi"
  },
  { 
    id: "permanentmarker", 
    name: "Permanent Marker", 
    value: "'Permanent Marker', cursive",
    description: "El yazısı stili yazı tipi"
  },
  { 
    id: "quicksand", 
    name: "Quicksand", 
    value: "'Quicksand', sans-serif",
    description: "Modern geometrik sans-serif"
  },
  { 
    id: "josefin", 
    name: "Josefin Sans", 
    value: "'Josefin Sans', sans-serif",
    description: "Art deco stilinde sans-serif"
  },
  { 
    id: "crimsonpro", 
    name: "Crimson Pro", 
    value: "'Crimson Pro', serif",
    description: "Akademik serif yazı tipi"
  },
  { 
    id: "spacegrotesk", 
    name: "Space Grotesk", 
    value: "'Space Grotesk', sans-serif",
    description: "Teknolojik görünümlü sans-serif"
  },
  { 
    id: "dmserif", 
    name: "DM Serif Display", 
    value: "'DM Serif Display', serif",
    description: "Modern kontrastlı serif"
  },
  { 
    id: "system", 
    name: "Sistem Yazı Tipi", 
    value: "system-ui, sans-serif",
    description: "Sistemin varsayılan yazı tipi"
  }
];

interface FontSettingsProps {
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
}

export function FontSettings({ 
  fontSize, 
  onFontSizeChange, 
  fontFamily, 
  onFontFamilyChange 
}: FontSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-medium">Yazı Boyutu</h3>
        <Select value={fontSize} onValueChange={onFontSizeChange}>
          <SelectTrigger className="w-full">
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
        <h3 className="text-base sm:text-lg font-medium">Yazı Tipi</h3>
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Yazı tipi seçin" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {fontFamilies.map((font) => (
              <SelectItem 
                key={font.id} 
                value={font.id}
                className="py-2 px-2"
              >
                <div className="flex flex-col gap-0.5">
                  <span style={{ fontFamily: font.value }} className="text-sm">{font.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{font.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 sm:p-6 mt-4">
        <h4 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Önizleme</h4>
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 style={{ 
              fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.heading,
              fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
            }} className="font-semibold">
              Bu bir başlık örneğidir
            </h2>
            <p style={{ 
              fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
              fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
            }} className="leading-relaxed text-sm sm:text-base">
              Bu bir örnek metindir. Seçtiğiniz yazı tipi ve boyutunu burada görebilirsiniz.
              ABCÇDEFGĞHIIJKLMNOÖPRSŞTUÜVYZ
              abcçdefgğhıijklmnoöprsştuüvyz
              1234567890
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4">
              <h5 style={{ 
                fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
                fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
              }} className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Kart Başlığı
              </h5>
              <p style={{ 
                fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
                fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
              }} className="text-muted-foreground text-xs sm:text-sm">
                Kart içeriği örneği
              </p>
            </Card>
            <Card className="p-3 sm:p-4 bg-primary text-primary-foreground">
              <h5 style={{ 
                fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
                fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
              }} className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Vurgulu Kart
              </h5>
              <p style={{ 
                fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
                fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
              }} className="text-xs sm:text-sm">
                Renkli kart içeriği
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}