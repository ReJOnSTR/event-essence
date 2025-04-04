
import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
  isDraggable?: boolean;
  onTouchStart?: (e: React.TouchEvent) => void;
  onResizeStart?: (event: CalendarEvent, type: 'start' | 'end', y: number) => void;
  isResizable?: boolean;
  isPreview?: boolean;
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true,
  onTouchStart,
  onResizeStart,
  isResizable = true,
  isPreview = false
}: EventCardProps) {
  const startMinutes = new Date(event.start).getMinutes();
  const durationInMinutes = differenceInMinutes(new Date(event.end), new Date(event.start));
  const heightInPixels = Math.max((durationInMinutes / 60) * 60, 40);
  const student = students?.find(s => s.id === event.studentId);
  const isCompact = heightInPixels <= 40;

  const style = {
    height: `${heightInPixels}px`,
    top: `${(startMinutes / 60) * 60}px`,
    zIndex: isPreview ? 20 : 10,
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

  const handleResizeStart = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    if (onResizeStart) {
      e.stopPropagation();
      onResizeStart(event, type, e.clientY);
    }
  };

  const handleTouchResizeStart = (type: 'start' | 'end') => (e: React.TouchEvent) => {
    if (onResizeStart) {
      e.stopPropagation();
      onResizeStart(event, type, e.touches[0].clientY);
    }
  };

  // Create the element with appropriate animations
  const content = (provided?: any, snapshot?: any) => {
    const card = (
      <motion.div
        ref={provided?.innerRef}
        {...(provided?.draggableProps || {})}
        {...(provided?.dragHandleProps || {})}
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1
        }}
        className={cn(
          "text-white p-2 rounded absolute left-1 right-1 overflow-hidden cursor-pointer transition-all shadow-sm touch-none",
          snapshot?.isDragging || isPreview ? "shadow-md ring-2 ring-white/30 z-50" : "",
          isCompact ? "flex items-center justify-between gap-1" : "",
          isResizable ? "group" : "",
          isPreview ? "opacity-90" : ""
        )}
        style={{
          ...style,
          ...(provided?.draggableProps?.style || {}),
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        {isResizable && (
          <>
            <div 
              className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize group-hover:bg-black/20 rounded-t"
              onMouseDown={handleResizeStart('start')}
              onTouchStart={handleTouchResizeStart('start')}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize group-hover:bg-black/20 rounded-b"
              onMouseDown={handleResizeStart('end')}
              onTouchStart={handleTouchResizeStart('end')}
            />
          </>
        )}

        {isCompact ? (
          <>
            <div className="font-medium text-xs truncate flex-1">
              {student?.name || "İsimsiz Öğrenci"}
            </div>
            <div className="text-xs whitespace-nowrap">
              {format(new Date(event.start), "HH:mm", { locale: tr })}
              <span className="mx-0.5">-</span>
              {format(new Date(event.end), "HH:mm", { locale: tr })}
            </div>
          </>
        ) : (
          <>
            <div className="font-medium text-[13px] leading-tight md:text-sm">
              {student?.name || "İsimsiz Öğrenci"}
            </div>
            <div className="text-[12px] md:text-xs flex items-center gap-1.5 opacity-90 mt-0.5">
              <span>{format(new Date(event.start), "HH:mm", { locale: tr })}</span>
              <span className="text-white/90">-</span>
              <span>{format(new Date(event.end), "HH:mm", { locale: tr })}</span>
            </div>
          </>
        )}
      </motion.div>
    );
    
    return card;
  };

  if (!isDraggable) {
    return content();
  }

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  );
}
