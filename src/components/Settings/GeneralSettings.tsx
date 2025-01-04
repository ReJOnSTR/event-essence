import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getDefaultLessonDuration, setDefaultLessonDuration } from "@/utils/settings";

export default function GeneralSettings() {
  const [defaultDuration, setDefaultDuration] = useState(() => getDefaultLessonDuration().toString());
  const { toast } = useToast();

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDefaultDuration(value);
    
    const numericValue = parseInt(value);
    if (numericValue > 0) {
      setDefaultLessonDuration(numericValue);
      toast({
        title: "Ayarlar güncellendi",
        description: "Varsayılan ders süresi başarıyla kaydedildi.",
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
            value={defaultDuration}
            onChange={handleDurationChange}
            min="1"
            className="max-w-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            Yeni ders eklerken otomatik olarak ayarlanacak süre
          </p>
        </div>
      </CardContent>
    </Card>
  );
}