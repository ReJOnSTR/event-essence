import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

interface EventCardProps {
  event: CalendarEvent;
  students?: Student[];
  index: number;
  onClick?: (event: CalendarEvent) => void;
}

export default function MonthEventCard({ event, students, index, onClick }: EventCardProps) {
  const student = students?.find(s => s.id === event.studentId);

  const content = (provided?: any, snapshot?: any) => (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ 
        scale: snapshot?.isDragging ? 1.05 : 1,
        opacity: snapshot?.isDragging ? 0.8 : 1,
        boxShadow: snapshot?.isDragging ? "0 8px 20px rgba(0,0,0,0.12)" : "none",
        zIndex: snapshot?.isDragging ? 50 : 'auto'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`text-white text-sm p-1 rounded mb-1 cursor-pointer hover:brightness-90 transition-all`}
      style={{ 
        backgroundColor: student?.color || "#039be5",
        ...(provided?.draggableProps?.style || {})
      }}
      onClick={() => onClick?.(event)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">
          {student?.name || "İsimsiz Öğrenci"}
        </span>
        <span className="text-xs whitespace-nowrap">
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