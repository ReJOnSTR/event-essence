import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getTurkishHolidays } from "@/utils/turkishHolidays";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Holiday {
  date: Date;
  description: string;
}

export default function HolidaySettings() {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    const savedHolidays = localStorage.getItem('holidays');
    return savedHolidays ? JSON.parse(savedHolidays).map((h: Holiday) => new Date(h.date)) : [];
  });
  
  const [allowWorkOnHolidays, setAllowWorkOnHolidays] = useState(() => {
    return localStorage.getItem('allowWorkOnHolidays') === 'true';
  });

  const { toast } = useToast();

  const officialHolidays = getTurkishHolidays(new Date().getFullYear());

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
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4">Özel Tatil Günlerini Seçin</h3>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded-md border"
          />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4">Resmi Tatil Günleri</h3>
          <div className="space-y-2">
            {officialHolidays.map((holiday, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <span className="font-medium">{holiday.name}</span>
                <span className="text-sm text-gray-600">
                  {format(holiday.date, "d MMMM yyyy", { locale: tr })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}