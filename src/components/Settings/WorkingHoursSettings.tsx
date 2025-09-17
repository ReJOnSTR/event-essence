import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useWorkingHours } from "@/hooks/useWorkingHours";
import { WeeklyWorkingHours } from "@/types/calendar";

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
  const { workingHours, updateWorkingHours, isLoading } = useWorkingHours();
  const [localWorkingHours, setLocalWorkingHours] = useState<WeeklyWorkingHours | null>(null);

  useEffect(() => {
    if (workingHours) {
      setLocalWorkingHours(workingHours);
    }
  }, [workingHours]);

  if (isLoading || !localWorkingHours) {
    return <div>Yükleniyor...</div>;
  }

  const handleChange = (
    day: keyof WeeklyWorkingHours,
    field: "start" | "end" | "enabled",
    value: string | boolean
  ) => {
    const newHours = {
      ...localWorkingHours,
      [day]: {
        ...localWorkingHours[day],
        [field]: value
      }
    };
    setLocalWorkingHours(newHours);
    updateWorkingHours(newHours);
  };

  const resetDay = (day: keyof WeeklyWorkingHours) => {
    const newHours = {
      ...localWorkingHours,
      [day]: DEFAULT_DAY
    };
    setLocalWorkingHours(newHours);
    updateWorkingHours(newHours);
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
    setLocalWorkingHours(defaultHours);
    updateWorkingHours(defaultHours);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CardTitle>Çalışma Saatleri</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAll}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Tümünü Sıfırla
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(Object.entries(DAYS) as [keyof WeeklyWorkingHours, string][]).map(([day, label]) => (
            <div key={day} className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-40">
                <Switch
                  checked={localWorkingHours[day]?.enabled ?? false}
                  onCheckedChange={(checked) => handleChange(day, "enabled", checked)}
                  className="order-2 sm:order-1"
                />
                <Label className="order-1 sm:order-2 font-medium">{label}</Label>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="time"
                    value={localWorkingHours[day]?.start ?? "09:00"}
                    onChange={(e) => handleChange(day, "start", e.target.value)}
                    disabled={!localWorkingHours[day]?.enabled}
                    className="w-full sm:w-32"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="time"
                    value={localWorkingHours[day]?.end ?? "17:00"}
                    onChange={(e) => handleChange(day, "end", e.target.value)}
                    disabled={!localWorkingHours[day]?.enabled}
                    className="w-full sm:w-32"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => resetDay(day)}
                  className="ml-0 sm:ml-auto"
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