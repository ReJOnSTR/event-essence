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
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-2 rounded mb-1.5 cursor-pointer transition-all duration-200",
            snapshot.isDragging ? "shadow-lg opacity-90 scale-[1.02]" : "shadow-sm hover:brightness-95"
          )}
          style={{ 
            backgroundColor: student?.color || "#039be5",
            ...provided.draggableProps.style,
            transition: snapshot.isDragging 
              ? provided.draggableProps.style?.transition 
              : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onClick={handleClick}
        >
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1"
          >
            <span className="font-medium text-[13px] leading-tight md:text-sm text-white">
              {student?.name || "İsimsiz Öğrenci"}
            </span>
            <span className="text-[12px] md:text-xs text-white/90">
              {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
            </span>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}