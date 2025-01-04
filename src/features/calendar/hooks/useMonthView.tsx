import { startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, setHours } from "date-fns";
import { CalendarEvent, DayCell } from "@/types/calendar";
import { getWorkingHours } from "@/utils/workingHours";

export function useMonthView(date: Date, events: CalendarEvent[]) {
  const getDaysInMonth = (currentDate: Date): DayCell[] => {
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
      isCurrentMonth: isSameMonth(dayDate, currentDate),
      lessons: events
        .filter(event => isSameDay(new Date(event.start), dayDate))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      const dateWithWorkingHours = new Date(clickedDate);
      dateWithWorkingHours.setHours(hours, minutes, 0);
      return dateWithWorkingHours;
    }
    
    return setHours(clickedDate, 9);
  };

  return {
    getDaysInMonth,
    handleDateClick
  };
}