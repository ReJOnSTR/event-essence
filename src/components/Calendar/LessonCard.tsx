
import { CalendarEvent, Student } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  students?: Student[];
  index: number;
  isDraggable?: boolean;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export default function LessonCard({ 
  event, 
  onClick, 
  students, 
  index,
  isDraggable = true,
  onTouchStart 
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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
      {...(provided?.dragHandleProps || {})}
      className={cn(
        "text-white p-2 rounded-lg absolute left-1 right-1 overflow-hidden cursor-move",
        "shadow-md hover:shadow-xl transition-all duration-200",
        "backdrop-blur-sm bg-opacity-95",
        snapshot?.isDragging && "ring-2 ring-white/50 shadow-2xl",
        isCompact ? "flex items-center justify-between gap-1" : ""
      )}
      style={{
        ...style,
        ...(provided?.draggableProps?.style || {}),
        transform: snapshot?.isDragging 
          ? `${provided?.draggableProps?.style?.transform || ''} rotate(2deg)` 
          : provided?.draggableProps?.style?.transform || '',
      }}
      animate={{
        scale: snapshot?.isDragging ? 1.05 : isHovered ? 1.02 : 1,
        opacity: snapshot?.isDragging ? 0.9 : 1,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.2
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle Indicator */}
      <AnimatePresence>
        {(isHovered || snapshot?.isDragging) && !isCompact && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1 top-1/2 -translate-y-1/2"
          >
            <GripVertical className="w-3 h-3 text-white/70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {!isCompact && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30"
          initial={{ width: "0%" }}
          animate={{ width: snapshot?.isDragging ? "100%" : isHovered ? "50%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className={cn("relative z-10", !isCompact && "pl-4")}>
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
            <motion.div 
              className="font-medium text-[13px] leading-tight md:text-sm truncate"
              animate={{ x: snapshot?.isDragging ? 2 : 0 }}
            >
              {student?.name || "İsimsiz Öğrenci"}
            </motion.div>
            <motion.div 
              className="text-[12px] md:text-xs flex items-center gap-1.5 opacity-90 mt-0.5"
              animate={{ x: snapshot?.isDragging ? 2 : 0 }}
            >
              <span>{format(event.start, "HH:mm", { locale: tr })}</span>
              <span className="text-white/90">-</span>
              <span>{format(event.end, "HH:mm", { locale: tr })}</span>
            </motion.div>
            
            {/* Duration indicator */}
            {durationInMinutes > 60 && (
              <motion.div 
                className="text-[10px] opacity-70 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.7 : 0 }}
              >
                {Math.floor(durationInMinutes / 60)} saat {durationInMinutes % 60 > 0 && `${durationInMinutes % 60} dk`}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Floating effect shadow */}
      {snapshot?.isDragging && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-black/20 blur-xl -z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ transform: "translateY(8px)" }}
        />
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
