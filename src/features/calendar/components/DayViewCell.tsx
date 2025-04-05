
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "@/components/Calendar/LessonCard";
import { motion, AnimatePresence } from "framer-motion";

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
  // Compute background color class instead of using motion animate
  const cellBgClass = isDisabled ? "bg-muted" : "bg-transparent";
  
  return (
    <Droppable droppableId={`${hour}:0`}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border relative",
            cellBgClass,
            snapshot.isDraggingOver && "bg-accent",
            isDisabled && "cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/50"
          )}
          onClick={onCellClick}
        >
          <AnimatePresence>
            {snapshot.isDraggingOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/30 rounded-sm pointer-events-none"
              />
            )}
          </AnimatePresence>
          
          {events
            .filter(event => new Date(event.start).getHours() === hour)
            .map((event, index) => (
              <LessonCard 
                key={event.id} 
                event={event} 
                onClick={onEventClick}
                students={students}
                index={index}
                customDragHandle={true}
              />
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
