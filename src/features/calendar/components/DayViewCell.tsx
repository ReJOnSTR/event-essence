
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "@/components/Calendar/LessonCard";
import { motion } from "framer-motion";

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
        <motion.div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "col-span-11 min-h-[60px] border-t border-border relative",
            isDisabled && "bg-muted cursor-not-allowed",
            !isDisabled && "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "drop-target-hover"
          )}
          animate={{
            backgroundColor: snapshot.isDraggingOver && !isDisabled ? "var(--accent)" : undefined,
            transition: { duration: 0.2 }
          }}
          whileHover={{ 
            backgroundColor: !isDisabled && !snapshot.isDraggingOver ? "rgba(var(--accent), 0.2)" : undefined 
          }}
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
          
          {snapshot.isDraggingOver && !isDisabled && (
            <motion.div 
              className="absolute inset-0 bg-accent/15 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.div>
      )}
    </Droppable>
  );
}
