import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// İlk kurulumda localStorage'a varsayılan değeri kaydet
if (localStorage.getItem('allowWorkOnHolidays') === null) {
  localStorage.setItem('allowWorkOnHolidays', 'true');
}

export function HolidaySettings() {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('holidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: { date: string }) => new Date(h.date)) : [];
  });
  
  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(() => {
    return localStorage.getItem('allowWorkOnHolidays') !== 'false'; // varsayılan olarak true
  });

  const { toast } = useToast();

  useEffect(() => {
    const holidays = selectedDates.map(date => ({
      date: date,
      description: "Tatil Günü"
    }));
    localStorage.setItem('holidays', JSON.stringify(holidays));
    toast({
      title: "Tatil günleri güncellendi",
      description: "Tatil günleri başarıyla kaydedildi.",
    });
  }, [selectedDates, toast]);

  useEffect(() => {
    localStorage.setItem('allowWorkOnHolidays', allowWorkOnHolidays.toString());
    toast({
      title: "Tatil günü çalışma ayarı güncellendi",
      description: allowWorkOnHolidays 
        ? "Tatil günlerinde çalışmaya izin verilecek" 
        : "Tatil günlerinde çalışma kapatıldı",
    });
  }, [allowWorkOnHolidays, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tatil Günleri Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-work"
            checked={allowWorkOnHolidays}
            onCheckedChange={setAllowWorkOnHolidays}
          />
          <Label htmlFor="allow-work">Tatil günlerinde çalışmaya izin ver</Label>
        </div>
        
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-4">Özel Tatil Günleri</h3>
            {selectedDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Henüz özel tatil günü eklenmemiş.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDates.map((date, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm">{date.toLocaleDateString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}