import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday, setHours } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import MonthEventCard from "./MonthEventCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";

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
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

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
    const holiday = isHoliday(clickedDate);
    if (holiday && !allowWorkOnHolidays) {
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    // Create a new date that keeps the clicked date but uses the current month's year and month
    const dateWithCurrentMonth = new Date(clickedDate);
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      dateWithCurrentMonth.setHours(hours, minutes, 0);
      onDateSelect(dateWithCurrentMonth);
    } else {
      // If the day is not enabled in working hours, use 9 AM as default
      dateWithCurrentMonth.setHours(9, 0, 0);
      onDateSelect(dateWithCurrentMonth);
    }
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
        
        {days.map((day, idx) => {
          const holiday = isHoliday(day.date);
          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day.date)}
              className={cn(
                "min-h-[120px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
                !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                isToday(day.date) && "bg-blue-50",
                holiday && !allowWorkOnHolidays && "bg-red-50",
                holiday && allowWorkOnHolidays && "bg-yellow-50",
                isYearView && "min-h-[40px]"
              )}
            >
              <div className={cn(
                "text-sm font-medium",
                isToday(day.date) && "text-calendar-blue",
                holiday && !allowWorkOnHolidays && "text-red-600",
                holiday && allowWorkOnHolidays && "text-yellow-700"
              )}>
                {format(day.date, "d")}
                {holiday && (
                  <div className={cn(
                    "text-xs truncate",
                    !allowWorkOnHolidays ? "text-red-600" : "text-yellow-700"
                  )}>
                    {holiday.name}
                    {allowWorkOnHolidays && " (Çalışmaya Açık)"}
                  </div>
                )}
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
          );
        })}
      </div>
    </div>
  );
}
