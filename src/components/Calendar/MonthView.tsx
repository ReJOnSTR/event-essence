import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday, setHours } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import MonthEventCard from "./MonthEventCard";
import { getDefaultStartHour } from "@/utils/settings";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  students
}: MonthViewProps) {
  const getDaysInMonth = (currentDate: Date): DayCell[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Adjust for Monday start
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6; // Sunday becomes last day
    
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
      lessons: events.filter(event => isSameDay(event.start, dayDate))
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const startHour = getDefaultStartHour();
    const dateWithStartHour = setHours(clickedDate, startHour);
    onDateSelect(dateWithStartHour);
  };

  const days = getDaysInMonth(date);

  return (
    <div className={cn("w-full mx-auto", isYearView && "h-full")}>
      <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => handleDateClick(day.date)}
            className={cn(
              "min-h-[120px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
              !day.isCurrentMonth && "bg-gray-50 text-gray-400",
              isToday(day.date) && "bg-blue-50",
              isYearView && "min-h-[40px]"
            )}
          >
            <div className={cn(
              "text-sm font-medium",
              isToday(day.date) && "text-calendar-blue"
            )}>
              {format(day.date, "d")}
            </div>
            {!isYearView && (
              <div className="space-y-1">
                {day.lessons.map((event) => (
                  <div key={event.id} onClick={(e) => {
                    e.stopPropagation();
                    if (onEventClick) onEventClick(event);
                  }}>
                    <MonthEventCard event={event} students={students} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}