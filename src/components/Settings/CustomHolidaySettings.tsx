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
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function CustomHolidaySettings() {
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();
  
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    return settings?.holidays?.map((h: { date: string }) => new Date(h.date)) || [];
  });

  useEffect(() => {
    if (settings?.holidays) {
      setSelectedDates(settings.holidays.map((h: { date: string }) => new Date(h.date)));
    }
  }, [settings?.holidays]);

  const handleSelect = async (dates: Date[] | undefined) => {
    if (!dates) return;
    
    setSelectedDates(dates);
    const holidays = dates.map(date => ({
      date: date.toISOString(),
      description: "Özel Tatil"
    }));
    
    try {
      await updateSettings.mutateAsync({
        holidays: holidays
      });
      
      toast({
        title: "Özel tatil günleri güncellendi",
        description: "Seçtiğiniz günler özel tatil olarak kaydedildi.",
      });
    } catch (error) {
      console.error('Error updating holidays:', error);
      toast({
        title: "Hata",
        description: "Tatil günleri güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const clearHolidays = async () => {
    try {
      setSelectedDates([]);
      await updateSettings.mutateAsync({
        holidays: []
      });
      
      toast({
        title: "Özel tatil günleri temizlendi",
        description: "Tüm özel tatil günleri kaldırıldı.",
      });
    } catch (error) {
      console.error('Error clearing holidays:', error);
      toast({
        title: "Hata",
        description: "Tatil günleri temizlenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleWorkOnHolidaysChange = async (checked: boolean) => {
    try {
      await updateSettings.mutateAsync({
        allow_work_on_holidays: checked
      });
      
      toast({
        title: "Tatil günü çalışma ayarı güncellendi",
        description: checked 
          ? "Tatil günlerinde çalışmaya izin verilecek" 
          : "Tatil günlerinde çalışma kapatıldı",
      });
    } catch (error) {
      console.error('Error updating work on holidays setting:', error);
      toast({
        title: "Hata",
        description: "Ayar güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
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
                checked={settings?.allow_work_on_holidays}
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