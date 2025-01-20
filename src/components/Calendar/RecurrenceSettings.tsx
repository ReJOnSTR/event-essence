import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { RecurrencePattern } from "@/types/calendar";

interface RecurrenceSettingsProps {
  recurrencePattern: RecurrencePattern | null;
  onRecurrenceChange: (pattern: RecurrencePattern | null) => void;
  startDate: Date;
}

export default function RecurrenceSettings({
  recurrencePattern,
  onRecurrenceChange,
  startDate,
}: RecurrenceSettingsProps) {
  const handleFrequencyChange = (value: string) => {
    if (value === "_none") {
      onRecurrenceChange(null);
      return;
    }
    
    onRecurrenceChange({
      frequency: value as RecurrencePattern["frequency"],
      interval: 1,
      endDate: null,
    });
  };

  const handleIntervalChange = (value: string) => {
    if (!value || !recurrencePattern) return;
    onRecurrenceChange({
      ...recurrencePattern,
      interval: parseInt(value),
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!recurrencePattern) return;
    onRecurrenceChange({
      ...recurrencePattern,
      endDate: date || null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tekrar Sıklığı</Label>
        <Select
          value={recurrencePattern?.frequency || "_none"}
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tekrar etmeyen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">Tekrar etmeyen</SelectItem>
            <SelectItem value="daily">Günlük</SelectItem>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recurrencePattern && (
        <>
          <div className="space-y-2">
            <Label>Tekrar Aralığı</Label>
            <Input
              type="number"
              min={1}
              value={recurrencePattern.interval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Bitiş Tarihi (Opsiyonel)</Label>
            <DatePicker
              date={recurrencePattern.endDate ? new Date(recurrencePattern.endDate) : undefined}
              onSelect={handleEndDateChange}
              fromDate={startDate}
              placeholder="Bitiş tarihi seçin"
            />
          </div>
        </>
      )}
    </div>
  );
}