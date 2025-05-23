
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

  const content = (provided?: any, snapshot?: any) => (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "text-white p-2 rounded mb-1.5 cursor-pointer hover:brightness-90 shadow-sm overflow-y-auto max-h-[60px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
        snapshot?.isDragging ? "drag-item-dragging" : "drag-item"
      )}
      style={{ 
        backgroundColor: student?.color || "#039be5",
        ...(provided?.draggableProps?.style || {})
      }}
      animate={{
        scale: snapshot?.isDragging ? 1.03 : 1,
        boxShadow: snapshot?.isDragging ? "0 5px 15px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        opacity: snapshot?.isDragging ? 0.85 : 1
      }}
      transition={{
        duration: 0.15,
        ease: "easeOut"
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium text-[13px] leading-tight md:text-sm">
          {student?.name || "İsimsiz Öğrenci"}
        </span>
        <span className="text-[12px] md:text-xs opacity-90">
          {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
        </span>
      </div>
    </motion.div>
  );

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}
