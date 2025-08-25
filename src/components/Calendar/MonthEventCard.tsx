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
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "p-2 rounded mb-1.5 cursor-pointer shadow-sm truncate text-white group",
        snapshot?.isDragging ? "z-50" : ""
      )}
      style={{ 
        backgroundColor: student?.color || "hsl(var(--primary))",
        transform: snapshot?.isDragging ? 'scale(1.08) rotate(3deg)' : 'scale(1)',
        boxShadow: snapshot?.isDragging ? 
          "0 15px 30px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.3)" : 
          "0 1px 3px rgba(0,0,0,0.1)",
        opacity: snapshot?.isDragging ? 0.9 : 1,
        transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        ...(provided?.draggableProps?.style || {})
      }}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 transition-transform group-hover:scale-[1.02]">
        <span className="font-medium text-[13px] leading-tight md:text-sm truncate">
          {student?.name || "İsimsiz Öğrenci"}
        </span>
        <span className="text-[12px] md:text-xs opacity-90 truncate">
          {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
        </span>
      </div>
    </div>
  );

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}