import { useState, useCallback } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addDays } from "date-fns";
import { CalendarEvent, DayCell } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";

export function useMonthView(date: Date, events: CalendarEvent[]) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const getDaysInMonth = useCallback((currentDate: Date): DayCell[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay() - 1;
    const suffixDays = Array.from({ length: endDay === -1 ? 0 : 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(dayDate => ({
      date: dayDate,
      isCurrentMonth: true,
      lessons: events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart.toDateString() === dayDate.toDateString();
      })
    }));
  }, [events]);

  const handleDateClick = useCallback((clickedDate: Date) => {
    const holiday = isHoliday(clickedDate);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    return clickedDate;
  }, [allowWorkOnHolidays, toast]);

  return {
    getDaysInMonth,
    handleDateClick,
    allowWorkOnHolidays
  };
}