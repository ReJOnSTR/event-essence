import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Droppable, DroppableProvided, DroppableStateSnapshot } from "@hello-pangea/dnd";
import LessonCard from "./LessonCard";

interface DayTimeSlotProps {
  hour: number;
  dayEvents: CalendarEvent[];
  isDraggingOver: boolean;
  isDisabled: boolean;
  onClick: () => void;
  students?: Student[];
  onEventClick?: (event: CalendarEvent) => void;
}

export default function DayTimeSlot({
  hour,
  dayEvents,
  isDraggingOver,
  isDisabled,
  onClick,
  students,
  onEventClick
}: DayTimeSlotProps) {
  return (
    <div 
      className={cn(
        "col-span-11 min-h-[60px] border-t border-border relative",
        isDraggingOver && "bg-accent",
        isDisabled && "bg-muted cursor-not-allowed"
      )}
      onClick={onClick}
    >
      {dayEvents
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
    </div>
  );
}