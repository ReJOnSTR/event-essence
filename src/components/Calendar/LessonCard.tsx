import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
  isDraggable?: boolean;
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true 
}: EventCardProps) {
  const startMinutes = new Date(event.start).getMinutes();
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60;
  const student = students?.find(s => s.id === event.studentId);

  const style = {
    height: `${heightInPixels}px`,
    top: `${(startMinutes / 60) * 60}px`,
    zIndex: 10,
    backgroundColor: student?.color || "#039be5",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  const content = (provided?: any, snapshot?: any) => (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ 
        scale: snapshot?.isDragging ? 1.05 : 1,
        opacity: snapshot?.isDragging ? 0.8 : 1,
        boxShadow: snapshot?.isDragging ? "0 8px 20px rgba(0,0,0,0.12)" : "none"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all`}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="font-medium truncate">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className="text-xs flex items-center gap-1">
        <span>{format(event.start, "HH:mm", { locale: tr })}</span>
        <span className="text-white/80">-</span>
        <span>{format(event.end, "HH:mm", { locale: tr })}</span>
      </div>
    </motion.div>
  );

  if (!isDraggable) {
    return content();
  }

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}