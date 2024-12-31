import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
          <h3 className="text-sm font-medium mb-4">Tatil Günlerini Seçin</h3>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded-md border"
          />
        </div>
      </CardContent>
    </Card>
  );
}