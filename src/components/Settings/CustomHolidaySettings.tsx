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

export default function CustomHolidaySettings() {
  const { 
    customHolidays, 
    updateCustomHolidays,
    allowWorkOnHolidays,
    updateAllowWorkOnHolidays
  } = useSettings();

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    updateCustomHolidays(dates);
  };

  const clearHolidays = () => {
    updateCustomHolidays([]);
  };

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
                onCheckedChange={updateAllowWorkOnHolidays}
              />
              <Label htmlFor="allow-work">Tatil günlerinde çalışmaya izin ver</Label>
            </div>

            <div className="text-sm text-muted-foreground">
              Takvimde özel tatil günü olarak işaretlemek istediğiniz günleri seçin.
            </div>

            <Calendar
              mode="multiple"
              selected={customHolidays}
              onSelect={handleSelect}
              className="rounded-md border"
              locale={tr}
            />

            {customHolidays.length > 0 && (
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
            {customHolidays.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Henüz seçili özel tatil günü bulunmamaktadır.
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-2">
                  {customHolidays
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