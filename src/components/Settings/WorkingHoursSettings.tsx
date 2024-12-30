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

export default function WorkingHoursSettings() {
  const [workingHours, setWorkingHoursState] = useState(() => getWorkingHours());
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
                  checked={workingHours[day].enabled}
                  onCheckedChange={(checked) => handleChange(day, "enabled", checked)}
                />
                <Label>{label}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={workingHours[day].start}
                  onChange={(e) => handleChange(day, "start", e.target.value)}
                  disabled={!workingHours[day].enabled}
                  className="w-32"
                />
                <span>-</span>
                <Input
                  type="time"
                  value={workingHours[day].end}
                  onChange={(e) => handleChange(day, "end", e.target.value)}
                  disabled={!workingHours[day].enabled}
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