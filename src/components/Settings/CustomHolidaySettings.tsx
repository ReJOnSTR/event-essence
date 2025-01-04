import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

export default function CustomHolidaySettings() {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('holidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: { date: string }) => new Date(h.date)) : [];
  });

  const { toast } = useToast();

  const handleSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    
    setSelectedDates(dates);
    const holidays = dates.map(date => ({
      date: date,
      description: "Özel Tatil"
    }));
    
    localStorage.setItem('holidays', JSON.stringify(holidays));
    
    toast({
      title: "Özel tatil günleri güncellendi",
      description: "Seçtiğiniz günler özel tatil olarak kaydedildi.",
    });
  };

  const clearHolidays = () => {
    setSelectedDates([]);
    localStorage.setItem('holidays', JSON.stringify([]));
    toast({
      title: "Özel tatil günleri temizlendi",
      description: "Tüm özel tatil günleri kaldırıldı.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Özel Tatil Günleri</CardTitle>
        <Gift className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Takvimde özel tatil günü olarak işaretlemek istediğiniz günleri seçin.
        </div>
        
        {selectedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDates.map((date, index) => (
              <Badge key={index} variant="secondary">
                {format(date, "d MMMM yyyy", { locale: tr })}
              </Badge>
            ))}
          </div>
        )}

        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={handleSelect}
          className="rounded-md border"
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
      </CardContent>
    </Card>
  );
}