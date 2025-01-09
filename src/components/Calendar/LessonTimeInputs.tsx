import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useUserSettings } from "@/hooks/useUserSettings";
import { tr } from "date-fns/locale";

interface LessonTimeInputsProps {
  startTime: string;
  endTime: string;
  selectedDate: Date;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export default function LessonTimeInputs({
  startTime,
  endTime,
  selectedDate,
  onStartTimeChange,
  onEndTimeChange
}: LessonTimeInputsProps) {
  const { settings } = useUserSettings();
  const workingHours = settings?.working_hours;
  const dayOfWeek = format(selectedDate, 'EEEE', { locale: tr }).toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours?.[dayOfWeek];

  const minTime = daySettings?.enabled ? daySettings.start : "09:00";
  const maxTime = daySettings?.enabled ? daySettings.end : "17:00";

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Başlangıç Saati</label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          min={minTime}
          max={maxTime}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Bitiş Saati</label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          min={minTime}
          max={maxTime}
          required
        />
      </div>
    </div>
  );
}