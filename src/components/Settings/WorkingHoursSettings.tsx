import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours, setWorkingHours, type WeeklyWorkingHours } from "@/utils/workingHours";

const DAYS = {
  monday: "Pazartesi",
  tuesday: "Salı",
  wednesday: "Çarşamba",
  thursday: "Perşembe",
  friday: "Cuma",
  saturday: "Cumartesi",
  sunday: "Pazar"
} as const;

const DEFAULT_WORKING_HOURS: WeeklyWorkingHours = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "09:00", end: "17:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" }
};

export default function WorkingHoursSettings() {
  const [workingHours, setWorkingHoursState] = useState<WeeklyWorkingHours>(() => {
    const savedHours = getWorkingHours();
    return Object.keys(DAYS).reduce((acc, day) => ({
      ...acc,
      [day]: {
        enabled: savedHours[day as keyof WeeklyWorkingHours]?.enabled ?? DEFAULT_WORKING_HOURS[day as keyof WeeklyWorkingHours].enabled,
        start: savedHours[day as keyof WeeklyWorkingHours]?.start ?? DEFAULT_WORKING_HOURS[day as keyof WeeklyWorkingHours].start,
        end: savedHours[day as keyof WeeklyWorkingHours]?.end ?? DEFAULT_WORKING_HOURS[day as keyof WeeklyWorkingHours].end,
      }
    }), {} as WeeklyWorkingHours);
  });
  
  const { toast } = useToast();

  const handleChange = (
    day: keyof WeeklyWorkingHours,
    field: "start" | "end" | "enabled",
    value: string | boolean
  ) => {
    const newHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value
      }
    };
    setWorkingHoursState(newHours);
    setWorkingHours(newHours);
    toast({
      title: "Ayarlar güncellendi",
      description: "Çalışma saatleri başarıyla kaydedildi.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Çalışma Saatleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(Object.entries(DAYS) as [keyof WeeklyWorkingHours, string][]).map(([day, label]) => (
            <div key={day} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-40">
                <Switch
                  checked={workingHours[day]?.enabled ?? false}
                  onCheckedChange={(checked) => handleChange(day, "enabled", checked)}
                />
                <Label>{label}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={workingHours[day]?.start ?? "09:00"}
                  onChange={(e) => handleChange(day, "start", e.target.value)}
                  disabled={!workingHours[day]?.enabled}
                  className="w-32"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={workingHours[day]?.end ?? "17:00"}
                  onChange={(e) => handleChange(day, "end", e.target.value)}
                  disabled={!workingHours[day]?.enabled}
                  className="w-32"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}