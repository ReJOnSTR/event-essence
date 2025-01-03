import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours, setWorkingHours, type WeeklyWorkingHours } from "@/utils/workingHours";
import { RotateCcw, Download, Upload } from "lucide-react";

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
  const [workingHours, setWorkingHoursState] = useState<WeeklyWorkingHours>(getWorkingHours);
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

  const resetDay = (day: keyof WeeklyWorkingHours) => {
    const newHours = {
      ...workingHours,
      [day]: DEFAULT_DAY
    };
    setWorkingHoursState(newHours);
    setWorkingHours(newHours);
    toast({
      title: "Gün sıfırlandı",
      description: `${DAYS[day]} günü varsayılan ayarlara döndürüldü.`,
    });
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
    setWorkingHoursState(defaultHours);
    setWorkingHours(defaultHours);
    toast({
      title: "Tüm günler sıfırlandı",
      description: "Çalışma saatleri varsayılan ayarlara döndürüldü.",
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(workingHours, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'working-hours.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Veriler dışa aktarıldı",
      description: "Çalışma saatleri başarıyla indirildi.",
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as WeeklyWorkingHours;
        setWorkingHoursState(imported);
        setWorkingHours(imported);
        toast({
          title: "Veriler içe aktarıldı",
          description: "Çalışma saatleri başarıyla yüklendi.",
        });
      } catch (error) {
        toast({
          title: "Hata",
          description: "Dosya içe aktarılırken bir hata oluştu.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Çalışma Saatleri</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Tümünü Sıfırla
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
          >
            <Download className="h-4 w-4 mr-2" />
            İndir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Yükle
          </Button>
          <input
            type="file"
            id="import-file"
            accept=".json"
            className="hidden"
            onChange={importData}
          />
        </div>
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