import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Input } from "@/components/ui/input";

interface LessonTimeInputsProps {
  startTime: string;
  endTime: string;
  selectedDate: Date;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}

export default function LessonTimeInputs({
  startTime,
  endTime,
  selectedDate,
  setStartTime,
  setEndTime,
}: LessonTimeInputsProps) {
  const formattedDate = format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr });

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Saat</div>
      <div className="text-sm text-muted-foreground mb-2">
        {formattedDate}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <span className="text-muted-foreground">-</span>
        <div className="flex-1">
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}