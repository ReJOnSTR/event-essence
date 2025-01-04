import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, index, onClick }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(event);
  };

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "p-2 rounded mb-1.5 cursor-pointer hover:brightness-90 transition-colors shadow-sm overflow-y-auto max-h-[60px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
            snapshot.isDragging ? "shadow-lg opacity-70" : ""
          )}
          style={{ 
            backgroundColor: student?.color || "hsl(var(--primary))",
            ...provided.draggableProps.style
          }}
          onClick={handleClick}
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium text-[13px] leading-tight md:text-sm text-primary-foreground">
              {student?.name || "İsimsiz Öğrenci"}
            </span>
            <span className="text-[12px] md:text-xs text-primary-foreground/90">
              {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
            </span>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}