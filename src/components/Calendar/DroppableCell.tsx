import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { Droppable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface DroppableCellProps {
  id: string;
  isDisabled?: boolean;
  isDayEnabled?: boolean;
  events: CalendarEvent[];
  date: Date;
  hour: number;
  children?: React.ReactNode;
  onCellClick?: () => void;
  className?: string;
}

export default function DroppableCell({
  id,
  isDisabled,
  isDayEnabled = true,
  events,
  date,
  hour,
  children,
  onCellClick,
  className
}: DroppableCellProps) {
  const checkConflict = (draggedEvent?: CalendarEvent) => {
    if (!draggedEvent) return false;
    
    const newStart = new Date(date);
    newStart.setHours(hour, 0, 0, 0);
    const duration = new Date(draggedEvent.end).getTime() - new Date(draggedEvent.start).getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    return checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      draggedEvent.id
    );
  };

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        const draggedEvent = events.find(event => 
          event.id === snapshot.draggingOverWith
        );
        const hasConflict = checkConflict(draggedEvent);

        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            onClick={onCellClick}
            className={cn(
              "relative min-h-[60px] border-t border-border transition-colors duration-200",
              isDisabled && "bg-muted cursor-not-allowed",
              !isDisabled && isDayEnabled && "cursor-pointer hover:bg-accent/50",
              snapshot.isDraggingOver && !hasConflict && "bg-accent/80 dark:bg-accent/40",
              hasConflict && "bg-destructive/20 dark:bg-destructive/40",
              className
            )}
          >
            {children}
            {provided.placeholder}

            <AnimatePresence>
              {snapshot.isDraggingOver && draggedEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={cn(
                    "absolute top-0 left-0 right-0 p-2 text-xs text-center",
                    "bg-background/80 backdrop-blur-sm border-b border-border",
                    hasConflict ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {format(date, "HH:mm")} - {draggedEvent.title}
                  {hasConflict && " (Çakışma)"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </Droppable>
  );
}