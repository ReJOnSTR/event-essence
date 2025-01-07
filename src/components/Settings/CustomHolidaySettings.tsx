import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/hooks/useSettings";

interface HolidaySettings {
  selectedDates: Date[];
  allowWorkOnHolidays: boolean;
}

export default function CustomHolidaySettings() {
  const { setting, saveSetting, isLoading } = useSettings('holidays');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(true);

  useEffect(() => {
    if (setting) {
      setSelectedDates(setting.selectedDates.map((d: string) => new Date(d)));
      setAllowWorkOnHolidays(setting.allowWorkOnHolidays);
    }
  }, [setting]);

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    
    setSelectedDates(dates);
    saveSetting({
      selectedDates: dates,
      allowWorkOnHolidays
    });
  };

  const clearHolidays = () => {
    setSelectedDates([]);
    saveSetting({
      selectedDates: [],
      allowWorkOnHolidays
    });
  };

  const handleWorkOnHolidaysChange = (checked: boolean) => {
    setAllowWorkOnHolidays(checked);
    saveSetting({
      selectedDates,
      allowWorkOnHolidays: checked
    });
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Özel Tatil Günleri</CardTitle>
        <Gift className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch
                id="allow-work"
                checked={allowWorkOnHolidays}
                onCheckedChange={handleWorkOnHolidaysChange}
              />
              <Label htmlFor="allow-work">Tatil günlerinde çalışmaya izin ver</Label>
            </div>

            <div className="text-sm text-muted-foreground">
              Takvimde özel tatil günü olarak işaretlemek istediğiniz günleri seçin.
            </div>

            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleSelect}
              className="rounded-md border"
              locale={tr}
            />

            {selectedDates.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearHolidays}
                className="w-full"
              >
                Tüm Özel Tatilleri Temizle
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium">Seçilen Özel Tatil Günleri</div>
            {selectedDates.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Henüz seçili özel tatil günü bulunmamaktadır.
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-2">
                  {selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Badge variant="secondary">
                          {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
                        </Badge>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}