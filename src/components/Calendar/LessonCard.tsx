import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const heightInPixels = Math.max((durationInMinutes / 60) * 60, 40);
  const student = students?.find(s => s.id === event.studentId);
  const isCompact = heightInPixels <= 40;

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
        scale: snapshot?.isDragging ? 1.02 : 1,
        opacity: snapshot?.isDragging ? 0.9 : 1,
        boxShadow: snapshot?.isDragging 
          ? "0 8px 20px rgba(0,0,0,0.12)" 
          : "0 2px 4px rgba(0,0,0,0.05)"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={cn(
        "text-white p-2 rounded absolute left-1 right-1 overflow-hidden cursor-pointer",
        isCompact ? "flex items-center justify-between gap-1" : ""
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
        transition: snapshot?.isDragging 
          ? provided?.draggableProps?.style?.transition 
          : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={handleClick}
    >
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className={cn("w-full", isCompact ? "flex items-center justify-between gap-1" : "space-y-0.5")}
        >
          {isCompact ? (
            <>
              <div className="font-medium text-xs truncate flex-1">
                {student?.name || "İsimsiz Öğrenci"}
              </div>
              <div className="text-xs whitespace-nowrap">
                {format(event.start, "HH:mm", { locale: tr })}
                <span className="mx-0.5">-</span>
                {format(event.end, "HH:mm", { locale: tr })}
              </div>
            </>
          ) : (
            <>
              <div className="font-medium text-[13px] leading-tight md:text-sm">
                {student?.name || "İsimsiz Öğrenci"}
              </div>
              <div className="text-[12px] md:text-xs flex items-center gap-1.5 opacity-90">
                <span>{format(event.start, "HH:mm", { locale: tr })}</span>
                <span className="text-white/90">-</span>
                <span>{format(event.end, "HH:mm", { locale: tr })}</span>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
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