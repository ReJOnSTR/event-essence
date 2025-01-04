import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { CalendarEvent } from "@/types/calendar";

export function useDayView(date: Date, events: CalendarEvent[]) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const holiday = isHoliday(date);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const startHour = daySettings?.enabled ? 
    parseInt(daySettings.start.split(':')[0]) : 
    9;
  const endHour = daySettings?.enabled ? 
    parseInt(daySettings.end.split(':')[0]) : 
    17;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleHourClick = (hour: number, minute: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour, minute);
    
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return null;
    }

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return null;
    }

    const currentTime = `${hour}:00`;
    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return null;
    }

    return eventDate;
  };

  return {
    dayEvents,
    hours,
    startHour,
    endHour,
    daySettings,
    holiday,
    allowWorkOnHolidays,
    handleHourClick
  };
}