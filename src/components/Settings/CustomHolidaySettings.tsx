import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomHolidaySettings() {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('customHolidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: { date: string }) => new Date(h.date)) : [];
  });

  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(() => {
    return localStorage.getItem('allowWorkOnHolidays') === 'true';
  });

  const { toast } = useToast();

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    
    setSelectedDates(dates);
    const holidays = dates.map(date => ({
      date: date,
      description: "Özel Tatil"
    }));
    
    localStorage.setItem('customHolidays', JSON.stringify(holidays));
    
    toast({
      title: "Özel tatil günleri güncellendi",
      description: "Seçtiğiniz günler özel tatil olarak kaydedildi.",
    });
  };

  const clearHolidays = () => {
    setSelectedDates([]);
    localStorage.setItem('customHolidays', JSON.stringify([]));
    toast({
      title: "Özel tatil günleri temizlendi",
      description: "Tüm özel tatil günleri kaldırıldı.",
    });
  };

  const handleWorkOnHolidaysChange = (checked: boolean) => {
    setAllowWorkOnHolidays(checked);
    localStorage.setItem('allowWorkOnHolidays', checked.toString());
    toast({
      title: "Tatil günü çalışma ayarı güncellendi",
      description: checked 
        ? "Tatil günlerinde çalışmaya izin verilecek" 
        : "Tatil günlerinde çalışma kapatıldı",
    });
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
            <div className="text-sm font-medium">
              Seçilen Özel Tatil Günleri
            </div>
            
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