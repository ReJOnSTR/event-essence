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
  { id: "inter", name: "Inter", value: "Inter, sans-serif" },
  { id: "roboto", name: "Roboto", value: "Roboto, sans-serif" },
  { id: "system", name: "Sistem Yazı Tipi", value: "system-ui, sans-serif" }
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
        <h3 className="text-lg font-medium">Yazı Boyutu</h3>
        <Select value={fontSize} onValueChange={onFontSizeChange}>
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
        <Select value={fontFamily} onValueChange={onFontFamilyChange}>
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

      <Card className="p-4 mt-4">
        <h4 className="text-lg font-medium mb-4">Önizleme</h4>
        <div className="space-y-4">
          <p style={{ 
            fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.base,
            fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
          }}>
            Bu bir örnek metindir. Seçtiğiniz yazı tipi ve boyutunu burada görebilirsiniz.
          </p>
          <h2 style={{ 
            fontSize: fontSizes[fontSize as keyof typeof fontSizes]?.heading,
            fontFamily: fontFamilies.find(f => f.id === fontFamily)?.value
          }}>
            Bu bir başlık örneğidir
          </h2>
        </div>
      </Card>
    </div>
  );
}