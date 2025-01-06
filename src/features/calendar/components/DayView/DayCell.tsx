import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "@/components/Calendar/LessonCard";
import { TimeIndicator } from "@/components/Calendar/TimeIndicator";

interface DayCellProps {
  hour: number;
  events: CalendarEvent[];
  isDisabled: boolean;
  onCellClick: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayCell({
  hour,
  events,
  isDisabled,
  onCellClick,
  onEventClick,
  students
}: DayCellProps) {
  const hourEvents = events.filter(event => 
    new Date(event.start).getHours() === hour
  );

  return (
    <Droppable droppableId={`${hour}:0`}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border relative",
            snapshot.isDraggingOver && "bg-accent",
            isDisabled && "bg-muted cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/50"
          )}
          onClick={onCellClick}
        >
          <TimeIndicator events={events} hour={hour} />
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