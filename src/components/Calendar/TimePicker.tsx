import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  date: Date;
  onChange: (date: Date) => void;
}

export function TimePicker({ date, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleHourChange = (hour: string) => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour));
    onChange(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    const newDate = new Date(date);
    newDate.setMinutes(parseInt(minute));
    onChange(newDate);
  };

  return (
    <div className="flex gap-2">
      <Select
        value={date.getHours().toString()}
        onValueChange={handleHourChange}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Saat" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, "0")}:00
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={Math.floor(date.getMinutes() / 5) * 5 .toString()}
        onValueChange={handleMinuteChange}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Dakika" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}