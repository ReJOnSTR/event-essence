
import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
  isDraggable?: boolean;
  onTouchStart?: (e: React.TouchEvent) => void;
  customDragHandle?: boolean;
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true,
  onTouchStart,
  customDragHandle = false
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (onTouchStart) {
      e.stopPropagation();
      onTouchStart(e);
    }
  };

  const content = (provided?: any, snapshot?: any) => (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(customDragHandle ? {} : provided?.dragHandleProps || {})}
      animate={{ 
        boxShadow: snapshot?.isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)",
        scale: snapshot?.isDragging ? 1.03 : 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "text-white p-2 rounded absolute left-1 right-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all touch-none",
        snapshot?.isDragging ? "shadow-lg opacity-85 z-50" : "",
        isCompact ? "flex items-center justify-between gap-1" : ""
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
    >
      {customDragHandle && provided?.dragHandleProps && (
        <div 
          {...provided.dragHandleProps} 
          className="absolute top-1 right-1 p-1 rounded-full opacity-60 hover:opacity-100 hover:bg-white/20"
        >
          <GripVertical size={12} />
        </div>
      )}
      
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
          <div className="text-[12px] md:text-xs flex items-center gap-1.5 opacity-90 mt-0.5">
            <span>{format(event.start, "HH:mm", { locale: tr })}</span>
            <span className="text-white/90">-</span>
            <span>{format(event.end, "HH:mm", { locale: tr })}</span>
          </div>
        </>
      )}
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
