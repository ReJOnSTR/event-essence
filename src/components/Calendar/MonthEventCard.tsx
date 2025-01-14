import { memo } from "react";
import { format } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

interface MonthEventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

const MonthEventCard = memo(({ event, students, index, onClick }: MonthEventCardProps) => {
  const student = students?.find(s => s.id === event.studentId);
  
  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClick?.(event)}
          className={cn(
            "p-1 rounded text-xs cursor-pointer transition-colors",
            snapshot.isDragging ? "opacity-50" : "hover:opacity-80",
            student?.color ? `bg-[${student.color}] text-white` : "bg-primary text-primary-foreground"
          )}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className="font-medium truncate">
            {format(new Date(event.start), "HH:mm")} - {student?.name || "İsimsiz Öğrenci"}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
});

MonthEventCard.displayName = "MonthEventCard";

export default MonthEventCard;