
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "@/components/Calendar/LessonCard";
import { motion } from "framer-motion";
import { useResizableLesson } from "@/hooks/useResizableLesson";

interface DayViewCellProps {
  hour: number;
  events: CalendarEvent[];
  isDraggingOver: boolean;
  isDisabled: boolean;
  onCellClick: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
  onEventUpdate?: (event: CalendarEvent) => void;
  isResizing?: boolean;
  resizingEventId?: string | null;
  draggedEventId?: string | null;
}

export default function DayViewCell({
  hour,
  events,
  isDraggingOver,
  isDisabled,
  onCellClick,
  onEventClick,
  students,
  onEventUpdate,
  isResizing,
  resizingEventId,
  draggedEventId
}: DayViewCellProps) {
  const hourEvents = events.filter(event => new Date(event.start).getHours() === hour);
  const { handleResizeStart, previewEvent } = useResizableLesson({ events, onEventUpdate });

  return (
    <Droppable droppableId={`${hour}:0`}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border relative",
            snapshot.isDraggingOver && "bg-accent/50",
            isDisabled && "bg-muted cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/20",
            isResizing && "bg-accent/30"
          )}
          onClick={onCellClick}
        >
          {hourEvents.map((event, index) => {
            const isBeingResized = resizingEventId === event.id;
            const isBeingDragged = draggedEventId === event.id;
            
            // If this event is being resized, we don't render it normally
            // as we'll show the preview version instead
            if (isBeingResized) return null;
            
            return (
              <LessonCard 
                key={event.id} 
                event={event} 
                onClick={onEventClick}
                students={students}
                index={index}
                onResizeStart={onEventUpdate ? handleResizeStart : undefined}
                isResizable={!!onEventUpdate}
                isBeingDragged={isBeingDragged}
              />
            );
          })}

          {/* Show preview event if resizing */}
          {previewEvent && new Date(previewEvent.start).getHours() === hour && (
            <LessonCard
              key={`preview-${previewEvent.id}`}
              event={previewEvent}
              students={students}
              index={-1}
              isDraggable={false}
              isResizable={false}
              isPreview={true}
            />
          )}
          
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
