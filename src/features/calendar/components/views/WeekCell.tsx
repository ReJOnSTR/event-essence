import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import MonthEventCard from "../cards/MonthEventCard";

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
  const cellEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() === day.getDate() && 
           eventDate.getMonth() === day.getMonth() && 
           eventDate.getHours() === hour;
  });

  return (
    <Droppable droppableId={`${dayIndex}-${hour}`} isDropDisabled={isWorkDisabled || isHourDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          onClick={onCellClick}
          className={cn(
            "p-1 border-r border-b border-border min-h-[60px] transition-colors duration-150",
            isWorkDisabled && "bg-muted cursor-not-allowed",
            isHourDisabled && "bg-muted/50",
            !isWorkDisabled && !isHourDisabled && "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isWorkDisabled && !isHourDisabled && "bg-accent/50"
          )}
        >
          {cellEvents.map((event, index) => (
            <MonthEventCard
              key={event.id}
              event={event}
              students={students}
              index={index}
              onClick={onEventClick}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}