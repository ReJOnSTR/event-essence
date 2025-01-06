import { CalendarEvent, Student } from "@/types/calendar";
import { useMonthView } from "../../hooks/useMonthView";
import { isHoliday } from "@/utils/turkishHolidays";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import MonthGrid from "./MonthGrid";
import { getWorkingHours } from "@/utils/workingHours";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) {
  const { getDaysInMonth } = useMonthView(date, events);
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const workingHours = getWorkingHours();

  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-background/80 p-1 text-xs font-medium text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            const dayOfWeek = day.date.getDay();
            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
            const daySettings = workingHours[daysOfWeek[dayOfWeek]];
            const isDisabled = !daySettings?.enabled || (holiday && !allowWorkOnHolidays);

            return (
              <div
                key={idx}
                onClick={() => !isDisabled && onDateSelect(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-background/80 transition-colors duration-150",
                  !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
                  isToday(day.date) && "bg-accent text-accent-foreground",
                  holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
                  holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
                  isDisabled ? "cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent/50"
                )}
              >
                <div className="text-xs font-medium">
                  {format(day.date, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <MonthGrid
      days={days}
      weekDays={weekDays}
      onDateSelect={onDateSelect}
      onEventClick={onEventClick}
      onEventUpdate={onEventUpdate}
      students={students}
      events={events}
    />
  );
}