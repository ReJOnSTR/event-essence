
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addDays,
  isSameMonth,
  format,
  setHours,
  setMinutes,
  differenceInMinutes,
  addMinutes
} from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent } from "@/types/calendar";

export const getDaysInMonth = (currentDate: Date, events: CalendarEvent[]) => {
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
    lessons: events.filter(event => 
      format(new Date(event.start), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd')
    )
  }));
};

export const getWeekDays = (date: Date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const formatTime = (date: Date) => {
  return format(date, 'HH:mm', { locale: tr });
};

export const createDateWithTime = (date: Date, hour: number, minute: number = 0) => {
  return setMinutes(setHours(date, hour), minute);
};

export const resizeEvent = (
  event: CalendarEvent, 
  resizeType: 'start' | 'end', 
  deltaMinutes: number,
  minDuration: number = 15
): { start: Date, end: Date } => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  
  if (resizeType === 'start') {
    const newStart = addMinutes(start, deltaMinutes);
    const currentDuration = differenceInMinutes(end, newStart);
    
    if (currentDuration < minDuration) {
      return {
        start: addMinutes(end, -minDuration),
        end
      };
    }
    
    return {
      start: newStart,
      end
    };
  } else {
    const newEnd = addMinutes(end, deltaMinutes);
    const currentDuration = differenceInMinutes(newEnd, start);
    
    if (currentDuration < minDuration) {
      return {
        start,
        end: addMinutes(start, minDuration)
      };
    }
    
    return {
      start,
      end: newEnd
    };
  }
};
