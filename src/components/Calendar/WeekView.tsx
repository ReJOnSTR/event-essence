import React from "react";
import { startOfWeek, addDays } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import WeekViewHeader from "./WeekViewHeader";
import WeekViewTimeGrid from "./WeekViewTimeGrid";
import { getWorkingHours } from "@/utils/workingHours";
import { cn } from "@/lib/utils";

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
  const workingHours = getWorkingHours();
  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0])));

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <WeekViewHeader weekDays={weekDays} />
      <div className="flex-1 overflow-auto">
        <div className={cn(
          "grid grid-cols-[auto_repeat(7,1fr)]",
          "divide-x divide-border border border-border rounded-lg mt-2",
          "min-w-[800px]"
        )}>
          <WeekViewTimeGrid
            weekDays={weekDays}
            hours={hours}
            events={events}
            workingHours={workingHours}
            allowWorkOnHolidays={localStorage.getItem('allowWorkOnHolidays') === 'true'}
            onCellClick={onDateSelect}
            onEventClick={onEventClick}
            onEventUpdate={onEventUpdate}
            students={students}
          />
        </div>
      </div>
    </div>
  );
}