import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "../shared/LessonCard";

interface DayViewCellProps {
  hour: number;
  events: CalendarEvent[];
  isDraggingOver: boolean;
  isDisabled: boolean;
  onCellClick: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayViewCell({
  hour,
  events,
  isDraggingOver,
  isDisabled,
  onCellClick,
  onEventClick,
  students
}: DayViewCellProps) {
  return (
    <Droppable droppableId={`${hour}:0`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border relative",
            snapshot.isDraggingOver && "bg-accent",
            isDisabled ? "cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent/50"
          )}
          onClick={onCellClick}
        >
          {events
            .filter(event => new Date(event.start).getHours() === hour)
            .map((event, index) => (
              <LessonCard 
                key={event.id} 
                event={event}
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