import { format } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

interface MonthEventCardProps {
  event: CalendarEvent;
  index: number;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthEventCard({ event, index, onClick, students }: MonthEventCardProps) {
  const student = students?.find(s => s.id === event.studentId);
  
  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(event);
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: index * 0.05,
            ease: [0.23, 1, 0.32, 1]
          }}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium cursor-pointer transition-colors",
            snapshot.isDragging && "opacity-50",
            student?.color ? `bg-[${student.color}]/10 text-[${student.color}] hover:bg-[${student.color}]/20` : "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          style={{
            backgroundColor: student?.color ? `${student.color}20` : undefined,
            color: student?.color || undefined
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-medium truncate">
              {student?.name || event.title}
            </span>
            <span className="text-[10px] opacity-75">
              {format(new Date(event.start), "HH:mm")}
            </span>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}