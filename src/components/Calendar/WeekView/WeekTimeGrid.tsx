import React from "react";
import { format } from "date-fns";
import { DragDropContext } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import WeekHourLabel from "./WeekHourLabel";
import WeekCell from "./WeekCell";
import { useWeekGrid } from "./useWeekGrid";
import { isHoliday } from "@/utils/turkishHolidays";

interface WeekTimeGridProps {
  weekDays: Date[];
  hours: number[];
  events: CalendarEvent[];
  workingHours: any;
  allowWorkOnHolidays: boolean;
  onCellClick: (day: Date, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekTimeGrid({
  weekDays,
  hours,
  events,
  workingHours,
  allowWorkOnHolidays,
  onCellClick,
  onEventClick,
  onEventUpdate,
  students
}: WeekTimeGridProps) {
  const { handleCellClick, handleDragEnd } = useWeekGrid();

  return (
    <DragDropContext 
      onDragEnd={(result) => handleDragEnd(
        result,
        weekDays,
        events,
        workingHours,
        allowWorkOnHolidays,
        onEventUpdate
      )}
    >
      {hours.map((hour) => (
        <React.Fragment key={`hour-${hour}`}>
          <WeekHourLabel hour={hour} />
          {weekDays.map((day, dayIndex) => {
            const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
            const daySettings = workingHours[dayOfWeek];
            const isDayEnabled = daySettings?.enabled;
            const holiday = isHoliday(day);
            const isWorkDisabled = (holiday && !allowWorkOnHolidays) || !isDayEnabled;
            const [startHour] = (daySettings?.start || "09:00").split(':').map(Number);
            const [endHour] = (daySettings?.end || "17:00").split(':').map(Number);
            const isHourDisabled = hour < startHour || hour >= endHour;

            return (
              <WeekCell
                key={`${day}-${hour}`}
                day={day}
                hour={hour}
                dayIndex={dayIndex}
                events={events}
                isWorkDisabled={isWorkDisabled}
                isHourDisabled={isHourDisabled}
                onCellClick={() => handleCellClick(
                  day,
                  hour,
                  workingHours,
                  allowWorkOnHolidays,
                  onCellClick
                )}
                onEventClick={onEventClick}
                students={students}
              />
            );
          })}
        </React.Fragment>
      ))}
    </DragDropContext>
  );
}