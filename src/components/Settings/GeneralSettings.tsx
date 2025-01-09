import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function GeneralSettings() {
  const { settings, updateSettings, isLoading } = useUserSettings();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 60) {
      updateSettings.mutate({
        default_lesson_duration: value
      });
    }
  };

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
            value={settings?.default_lesson_duration}
            onChange={handleDurationChange}
            min="1"
            max="60"
            className="max

-w-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            Yeni ders eklerken otomatik olarak ayarlanacak süre (1-60 dakika arası)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}