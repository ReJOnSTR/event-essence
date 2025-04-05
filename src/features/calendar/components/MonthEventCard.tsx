
import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GripHorizontal } from "lucide-react";

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

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={false}
          animate={{ 
            boxShadow: snapshot.isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.1)",
            scale: snapshot.isDragging ? 1.03 : 1,
            opacity: snapshot.isDragging ? 0.85 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "text-white p-2 rounded mb-1.5 cursor-grab hover:brightness-90 transition-all shadow-sm overflow-y-auto max-h-[60px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative",
            snapshot.isDragging && "shadow-lg cursor-grabbing z-50"
          )}
          style={{ 
            backgroundColor: student?.color || "#039be5",
            ...provided.draggableProps.style
          }}
          onClick={handleClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-[13px] leading-tight md:text-sm">
                {student?.name || "İsimsiz Öğrenci"}
              </div>
              <div className="text-[12px] md:text-xs opacity-90">
                {format(new Date(event.start), "HH:mm", { locale: tr })} - {format(new Date(event.end), "HH:mm", { locale: tr })}
              </div>
            </div>
            {snapshot.isDragging && (
              <span className="ml-1 opacity-60">
                <GripHorizontal size={14} />
              </span>
            )}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
