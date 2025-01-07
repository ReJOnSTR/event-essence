import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import type { WeeklyWorkingHours } from "@/utils/workingHours";

const DAYS = {
  monday: "Pazartesi",
  tuesday: "Salı",
  wednesday: "Çarşamba",
  thursday: "Perşembe",
  friday: "Cuma",
  saturday: "Cumartesi",
  sunday: "Pazar"
} as const;

const DEFAULT_DAY = {
  start: "09:00",
  end: "17:00",
  enabled: true
};

export default function WorkingHoursSettings() {
  const { setting, saveSetting, isLoading } = useSettings('working_hours');
  const [workingHours, setWorkingHours] = useState<WeeklyWorkingHours>(() => {
    return setting || {
      monday: DEFAULT_DAY,
      tuesday: DEFAULT_DAY,
      wednesday: DEFAULT_DAY,
      thursday: DEFAULT_DAY,
      friday: DEFAULT_DAY,
      saturday: { ...DEFAULT_DAY, enabled: false },
      sunday: { ...DEFAULT_DAY, enabled: false }
    };
  });

  useEffect(() => {
    if (setting) {
      setWorkingHours(setting);
    }
  }, [setting]);

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
    setWorkingHours(newHours);
    saveSetting(newHours);
  };

  const resetDay = (day: keyof WeeklyWorkingHours) => {
    const newHours = {
      ...workingHours,
      [day]: DEFAULT_DAY
    };
    setWorkingHours(newHours);
    saveSetting(newHours);
  };

  const resetAll = () => {
    const defaultHours: WeeklyWorkingHours = {
      monday: DEFAULT_DAY,
      tuesday: DEFAULT_DAY,
      wednesday: DEFAULT_DAY,
      thursday: DEFAULT_DAY,
      friday: DEFAULT_DAY,
      saturday: { ...DEFAULT_DAY, enabled: false },
      sunday: { ...DEFAULT_DAY, enabled: false }
    };
    setWorkingHours(defaultHours);
    saveSetting(defaultHours);
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Çalışma Saatleri</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAll}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Tümünü Sıfırla
        </Button>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => resetDay(day)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}