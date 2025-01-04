import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "./LessonCard";

interface DayTimeSlotProps {
  hour: number;
  dayEvents: CalendarEvent[];
  isDraggingOver: boolean;
  isDisabled: boolean;
  onClick: () => void;
  students?: Student[];
  onEventClick?: (event: CalendarEvent) => void;
  droppableId: string;
}

export default function DayTimeSlot({
  hour,
  dayEvents,
  isDraggingOver,
  isDisabled,
  onClick,
  students,
  onEventClick,
  droppableId
}: DayTimeSlotProps) {
  const hourEvents = dayEvents.filter(event => 
    new Date(event.start).getHours() === hour
  );

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative",
            snapshot.isDraggingOver && "bg-accent",
            isDisabled && "bg-muted cursor-not-allowed"
          )}
          onClick={onClick}
        >
          {hourEvents.map((event, index) => (
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