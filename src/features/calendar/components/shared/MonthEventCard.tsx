import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MonthEventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, index, onClick }: MonthEventCardProps) {
  const student = students?.find(s => s.id === event.student_id);
  const startTime = format(new Date(event.start), 'HH:mm', { locale: tr });

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: index * 0.02,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(event);
          }}
          style={{
            ...provided.draggableProps.style,
          }}
          className={cn(
            "text-xs p-1 rounded cursor-pointer transition-colors duration-150",
            snapshot.isDragging ? "opacity-50" : "hover:opacity-80",
            student?.color ? `bg-[${student.color}] text-white` : "bg-primary text-primary-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <span className="font-medium">{startTime}</span>
            <span className="truncate">{student?.name || 'İsimsiz Öğrenci'}</span>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}