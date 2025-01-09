import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getWorkingHours } from "@/utils/workingHours";
import { tr } from "date-fns/locale";

interface LessonTimeInputsProps {
  startTime: Date;
  endTime: Date;
  selectedDate: Date;
  onStartTimeChange: (value: Date) => void;
  onEndTimeChange: (value: Date) => void;
}

export default function LessonTimeInputs({
  startTime,
  endTime,
  selectedDate,
  onStartTimeChange,
  onEndTimeChange
}: LessonTimeInputsProps) {
  const workingHours = getWorkingHours();
  const dayOfWeek = format(selectedDate, 'EEEE', { locale: tr }).toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  // Çalışma saatlerini al
  const minTime = daySettings?.enabled ? daySettings.start : "09:00";
  const maxTime = daySettings?.enabled ? daySettings.end : "17:00";

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(startTime);
    newDate.setHours(hours, minutes);
    onStartTimeChange(newDate);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(endTime);
    newDate.setHours(hours, minutes);
    onEndTimeChange(newDate);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Başlangıç Saati</label>
        <Input
          type="time"
          value={format(startTime, 'HH:mm')}
          onChange={handleStartTimeChange}
          min={minTime}
          max={maxTime}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Bitiş Saati</label>
        <Input
          type="time"
          value={format(endTime, 'HH:mm')}
          onChange={handleEndTimeChange}
          min={minTime}
          max={maxTime}
          required
        />
      </div>
    </div>
  );
}