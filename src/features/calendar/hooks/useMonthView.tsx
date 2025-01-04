import { startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth } from "date-fns";
import { CalendarEvent, DayCell } from "@/types/calendar";

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
        .filter(event => {
          const eventStart = new Date(event.start);
          return eventStart.toDateString() === dayDate.toDateString();
        })
        .sort((a, b) => {
          const aStart = new Date(a.start).getTime();
          const bStart = new Date(b.start).getTime();
          return aStart - bStart;
        })
    }));
  };

  return {
    getDaysInMonth
  };
}