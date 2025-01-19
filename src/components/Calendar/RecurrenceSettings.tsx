import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { RecurrencePattern } from "@/types/calendar";

interface RecurrenceSettingsProps {
  recurrencePattern: RecurrencePattern | undefined;
  onRecurrenceChange: (pattern: RecurrencePattern | undefined) => void;
  startDate: Date;
}

export default function RecurrenceSettings({ 
  recurrencePattern, 
  onRecurrenceChange,
  startDate 
}: RecurrenceSettingsProps) {
  const [endType, setEndType] = useState<"never" | "date" | "occurrences">(
    recurrencePattern?.endDate ? "date" : 
    recurrencePattern?.count ? "occurrences" : 
    "never"
  );

  const handleFrequencyChange = (value: string) => {
    if (!value) return;
    onRecurrenceChange({
      frequency: value as "daily" | "weekly" | "monthly",
      interval: recurrencePattern?.interval || 1,
      endDate: recurrencePattern?.endDate,
      count: recurrencePattern?.count,
    });
  };

  const handleIntervalChange = (value: string) => {
    if (!value) return;
    onRecurrenceChange({
      ...recurrencePattern!,
      interval: parseInt(value),
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!recurrencePattern || !date) return;
    onRecurrenceChange({
      ...recurrencePattern,
      endDate: date,
      count: undefined,
    });
  };

  const handleEndTypeChange = (value: "never" | "date" | "occurrences") => {
    setEndType(value);
    if (!recurrencePattern) return;

    if (value === "never") {
      onRecurrenceChange({
        ...recurrencePattern,
        endDate: undefined,
        count: undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={recurrencePattern?.frequency || "daily"}
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tekrar sıklığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Günlük</SelectItem>
            <SelectItem value="weekly">Haftalık</SelectItem>
            <SelectItem value="monthly">Aylık</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(recurrencePattern?.interval || 1)}
          onValueChange={handleIntervalChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tekrar aralığı" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select value={endType} onValueChange={handleEndTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Bitiş" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Asla</SelectItem>
            <SelectItem value="date">Tarihte</SelectItem>
            <SelectItem value="occurrences">Tekrar sayısında</SelectItem>
          </SelectContent>
        </Select>

        {endType === "date" && (
          <DatePicker
            date={recurrencePattern?.endDate}
            onSelect={handleEndDateChange}
            placeholder="Bitiş tarihi seçin"
            fromDate={startDate}
          />
        )}
      </div>
    </div>
  );
}