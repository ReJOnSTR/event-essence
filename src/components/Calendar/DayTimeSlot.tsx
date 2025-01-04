import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { Droppable } from "@hello-pangea/dnd";
import LessonCard from "./LessonCard";
import { motion } from "framer-motion";

interface DayTimeSlotProps {
  hour: number;
  dayEvents: CalendarEvent[];
  isDraggingOver: boolean;
  isDisabled: boolean;
  onClick: () => void;
  students?: Student[];
  onEventClick?: (event: CalendarEvent) => void;
}

export default function DayTimeSlot({
  hour,
  dayEvents,
  isDraggingOver,
  isDisabled,
  onClick,
  students,
  onEventClick
}: DayTimeSlotProps) {
  return (
    <motion.div 
      className={cn(
        "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative",
        isDisabled && "bg-muted cursor-not-allowed"
      )}
      onClick={onClick}
      animate={{ 
        backgroundColor: isDraggingOver ? "rgb(var(--accent) / 0.5)" : "transparent",
        scale: isDraggingOver ? 1.005 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {dayEvents
        .filter(event => new Date(event.start).getHours() === hour)
        .map((event, index) => (
          <LessonCard 
            key={event.id} 
            event={event} 
            onClick={onEventClick}
            students={students}
            index={index}
          />
        ))}
    </motion.div>
  );
}