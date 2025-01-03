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
      className={`text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:brightness-90 ${
        snapshot?.isDragging ? "shadow-lg scale-[1.02] z-50" : ""
      }`}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      whileHover={{ scale: 1.01 }}
      whileDrag={{ 
        scale: 1.02,
        transition: { duration: 0.1 }
      }}
      layout
    >
      <div className="font-medium truncate">
        {student?.name || "İsimsiz Öğrenci"}
      </div>
      <div className={`text-xs flex items-center gap-1 transition-all ${
        snapshot?.isDragging ? "opacity-100" : "opacity-80"
      }`}>
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