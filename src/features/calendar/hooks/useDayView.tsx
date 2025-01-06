import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { getWorkingHours } from "@/utils/workingHours";

export function useDayView(date: Date) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const holiday = isHoliday(date);

  const dayOfWeek = date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const daySettings = workingHours[days[dayOfWeek]];

  const isHourDisabled = (hour: number) => {
    if (!daySettings?.enabled || (holiday && !allowWorkOnHolidays)) {
      return true;
    }

    const startHour = parseInt(daySettings.start.split(':')[0]);
    const endHour = parseInt(daySettings.end.split(':')[0]);
    return hour < startHour || hour >= endHour;
  };

  const handleHourClick = (hour: number, onDateSelect: (date: Date) => void) => {
    if (isHourDisabled(hour)) {
      if (holiday && !allowWorkOnHolidays) {
        toast({
          title: "Resmi Tatil",
          description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Çalışma saatleri dışında",
          description: "Bu saat çalışma saatleri dışındadır.",
          variant: "destructive"
        });
      }
      return;
    }

    const eventDate = new Date(date);
    eventDate.setHours(hour, 0);
    onDateSelect(eventDate);
  };

  return {
    isHourDisabled,
    handleHourClick,
    startHour: daySettings?.enabled ? parseInt(daySettings.start.split(':')[0]) : 9,
    endHour: daySettings?.enabled ? parseInt(daySettings.end.split(':')[0]) : 17
  };
}