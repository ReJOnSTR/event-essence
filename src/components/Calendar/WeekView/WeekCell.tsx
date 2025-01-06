import React from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "../LessonCard";
import { isHoliday } from "@/utils/turkishHolidays";

interface WeekCellProps {
  day: Date;
  hour: number;
  dayIndex: number;
  events: CalendarEvent[];
  isWorkDisabled: boolean;
  isHourDisabled: boolean;
  onCellClick: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekCell({
  day,
  hour,
  dayIndex,
  events,
  isWorkDisabled,
  isHourDisabled,
  onCellClick,
  onEventClick,
  students
}: WeekCellProps) {
  const isDisabled = isWorkDisabled || isHourDisabled;
  const holiday = isHoliday(day);

  return (
    <Droppable droppableId={`${dayIndex}-${hour}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "bg-background border-b border-border min-h-[60px] relative",
            isToday(day) && "bg-accent text-accent-foreground",
            isDisabled && "bg-muted cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && "bg-accent"
          )}
          onClick={onCellClick}
        >
          {events
            .filter(
              event =>
                format(new Date(event.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                new Date(event.start).getHours() === hour
            )
            .map((event, index) => (
              <LessonCard 
                key={event.id} 
                event={{
                  ...event,
                  start: new Date(event.start),
                  end: new Date(event.end)
                }}
                onClick={onEventClick}
                students={students}
                index={index}
              />
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}