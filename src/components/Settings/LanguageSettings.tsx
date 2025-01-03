import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages, getDefaultLanguage } from "@/utils/i18n/languages";
import { useToast } from "@/components/ui/use-toast";

export default function LanguageSettings() {
  const { toast } = useToast();
  const storedLang = localStorage.getItem('app-language');
  const defaultLang = getDefaultLanguage();

  useEffect(() => {
    if (!storedLang) {
      localStorage.setItem('app-language', defaultLang);
    }
  }, [defaultLang, storedLang]);

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('app-language', value);
    toast({
      title: "Dil değiştirildi",
      description: "Değişikliklerin tam olarak uygulanması için sayfayı yenileyin.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dil Ayarları</CardTitle>
        <CardDescription>
          Uygulama dilini değiştirin. Varsayılan olarak tarayıcı diliniz kullanılır.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Select
            defaultValue={storedLang || defaultLang}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Dil seçin" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}