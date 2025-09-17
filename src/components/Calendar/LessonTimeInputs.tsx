import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useUserSettings } from "@/hooks/useUserSettings";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const workingHours = settings?.working_hours;
  const dayOfWeek = format(selectedDate, 'EEEE', { locale: tr }).toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours?.[dayOfWeek];

  const handleStartTimeChange = (value: string) => {
    onStartTimeChange(value);
    
    // Validate against working hours if enabled
    if (daySettings?.enabled) {
      const [inputHour, inputMin] = value.split(':').map(Number);
      const [startHour, startMin] = daySettings.start.split(':').map(Number);
      const [endHour, endMin] = daySettings.end.split(':').map(Number);
      
      const inputMinutes = inputHour * 60 + inputMin;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (inputMinutes < startMinutes || inputMinutes >= endMinutes) {
        toast({
          title: "Çalışma Saatleri Dışında",
          description: `Bu gün için çalışma saatleri: ${daySettings.start} - ${daySettings.end}`,
          variant: "warning"
        });
      }
    }
  };

  const handleEndTimeChange = (value: string) => {
    onEndTimeChange(value);
    
    // Validate against working hours if enabled
    if (daySettings?.enabled) {
      const [inputHour, inputMin] = value.split(':').map(Number);
      const [startHour, startMin] = daySettings.start.split(':').map(Number);
      const [endHour, endMin] = daySettings.end.split(':').map(Number);
      
      const inputMinutes = inputHour * 60 + inputMin;
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (inputMinutes <= startMinutes || inputMinutes > endMinutes) {
        toast({
          title: "Çalışma Saatleri Dışında",
          description: `Bu gün için çalışma saatleri: ${daySettings.start} - ${daySettings.end}`,
          variant: "warning"
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Başlangıç Saati
          {daySettings?.enabled && (
            <span className="text-xs text-muted-foreground ml-2">
              ({daySettings.start} - {daySettings.end})
            </span>
          )}
        </label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Bitiş Saati
          {daySettings?.enabled && (
            <span className="text-xs text-muted-foreground ml-2">
              ({daySettings.start} - {daySettings.end})
            </span>
          )}
        </label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}