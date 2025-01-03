import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getShowTimeIndicators, setShowTimeIndicators } from "@/utils/settings";
import { useState } from "react";

export default function GeneralSettings() {
  const [showTimeIndicators, setShowTimeIndicatorsState] = useState(getShowTimeIndicators());

  const handleTimeIndicatorsChange = (checked: boolean) => {
    setShowTimeIndicatorsState(checked);
    setShowTimeIndicators(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Ayarlar</CardTitle>
        <CardDescription>
          Uygulama genelinde kullanılan ayarları buradan yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="show-time-indicators" className="flex flex-col space-y-1">
            <span>Zaman Göstergeleri</span>
            <span className="font-normal text-sm text-muted-foreground">
              Takvimde ders bitiş zamanlarını göster
            </span>
          </Label>
          <Switch
            id="show-time-indicators"
            checked={showTimeIndicators}
            onCheckedChange={handleTimeIndicatorsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}