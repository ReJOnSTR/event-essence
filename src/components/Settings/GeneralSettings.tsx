import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface GeneralSettingsData {
  defaultLessonDuration: number;
}

export default function GeneralSettings() {
  const { setting, saveSetting, isLoading } = useSettings('general');
  const [defaultDuration, setDefaultDuration] = useState("60");

  useEffect(() => {
    if (setting?.defaultLessonDuration) {
      setDefaultDuration(setting.defaultLessonDuration.toString());
    }
  }, [setting]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDefaultDuration(value);
    
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 60) {
      saveSetting({
        defaultLessonDuration: numericValue
      });
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Ayarlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="defaultDuration" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Varsayılan Ders Süresi (dakika)
          </Label>
          <Input
            id="defaultDuration"
            type="number"
            value={defaultDuration}
            onChange={handleDurationChange}
            min="1"
            max="60"
            className="max-w-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            Yeni ders eklerken otomatik olarak ayarlanacak süre (1-60 dakika arası)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}