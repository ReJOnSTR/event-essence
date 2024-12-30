import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isToday, setHours } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import CalendarHeader from "./CalendarHeader";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const nextWeek = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = addWeeks(date, 1);
    onDateSelect(next);
  };

  const prevWeek = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = subWeeks(date, 1);
    onDateSelect(prev);
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(new Date());
  };

  const handleCellClick = (e: React.MouseEvent, day: Date, hour: number) => {
    e.stopPropagation();
    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <div className="w-full overflow-x-auto" onClick={(e) => e.stopPropagation()}>
      <CalendarHeader
        date={date}
        onPrevious={prevWeek}
        onNext={nextWeek}
        onToday={goToToday}
        title={format(weekStart, "MMMM yyyy", { locale: tr })}
      />

      <div className="grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-white w-16"></div>
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "bg-white p-2 text-center",
              isToday(day) && "text-calendar-blue"
            )}
          >
            <div className="font-medium">
              {format(day, "EEEE", { locale: tr })}
            </div>
            <div className="text-sm text-gray-500">
              {format(day, "d MMM", { locale: tr })}
            </div>
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={`hour-${hour}`}>
            <div className="bg-white p-2 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            {weekDays.map((day) => (
              <div
                key={`${day}-${hour}`}
                className={cn(
                  "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 relative",
                  isToday(day) && "bg-blue-50"
                )}
                onClick={(e) => handleCellClick(e, day, hour)}
              >
                {events
                  .filter(
                    event =>
                      format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                      new Date(event.start).getHours() === hour
                  )
                  .map(event => (
                    <LessonCard 
                      key={event.id} 
                      event={event} 
                      onClick={onEventClick}
                      students={students}
                    />
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}