import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/useSettings";

export default function GeneralSettings() {
  const { toast } = useToast();
  const { defaultLessonDuration, setDefaultLessonDuration } = useSettings();
  const [localDuration, setLocalDuration] = useState(defaultLessonDuration.toString());

  useEffect(() => {
    setLocalDuration(defaultLessonDuration.toString());
  }, [defaultLessonDuration]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalDuration(value);
    
    const numericValue = value === '' ? 0 : Number(value);
    if (numericValue >= 0 && numericValue <= 60) {
      setDefaultLessonDuration(numericValue);
      toast({
        title: "Ayarlar güncellendi",
        description: "Varsayılan ders süresi başarıyla kaydedildi.",
      });
    } else if (numericValue > 60) {
      toast({
        title: "Geçersiz süre",
        description: "Ders süresi en fazla 60 dakika olabilir.",
        variant: "destructive"
      });
      setLocalDuration("60");
      setDefaultLessonDuration(60);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Ayarlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="defaultDuration"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Varsayılan Ders Süresi (Dakika)
          </label>
          <Input
            type="number"
            id="defaultDuration"
            value={localDuration}
            onChange={handleDurationChange}
            min="0"
            max="60"
            className="max-w-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            Yeni ders eklerken otomatik olarak ayarlanacak süre (0-60 dakika arası)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}