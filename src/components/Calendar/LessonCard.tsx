
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
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true,
  onTouchStart,
  onResizeStart,
  isResizable = true
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

  // Animasyon varyantları
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 12,
        stiffness: 100 
      } 
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: { 
        type: "spring", 
        damping: 10,
        stiffness: 120 
      }
    },
    tap: { 
      scale: 0.98 
    },
    drag: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      zIndex: 20
    }
  };

  const resizeHandleVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const content = (provided?: any, snapshot?: any) => (
    <motion.div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "text-white p-2 rounded absolute left-1 right-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all shadow-sm touch-none",
        snapshot?.isDragging ? "shadow-lg opacity-90 z-50" : "",
        isCompact ? "flex items-center justify-between gap-1" : "",
        isResizable ? "group" : ""
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      whileDrag={snapshot?.isDragging ? "drag" : undefined}
      layout
    >
      {isResizable && (
        <>
          <motion.div 
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize bg-black/20 rounded-t"
            onMouseDown={handleResizeStart('start')}
            onTouchStart={handleTouchResizeStart('start')}
            variants={resizeHandleVariants}
            initial="initial"
            whileHover="hover"
            animate={isResizable ? "hover" : "initial"}
          />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-black/20 rounded-b"
            onMouseDown={handleResizeStart('end')}
            onTouchStart={handleTouchResizeStart('end')}
            variants={resizeHandleVariants}
            initial="initial"
            whileHover="hover"
            animate={isResizable ? "hover" : "initial"}
          />
        </>
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
