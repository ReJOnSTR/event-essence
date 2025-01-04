import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "./MonthEventCard";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";

interface MonthCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  };
  idx: number;
  holiday: ReturnType<typeof isHoliday>;
  allowWorkOnHolidays: boolean;
  handleDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthCell({
  day,
  idx,
  holiday,
  allowWorkOnHolidays,
  handleDateClick,
  onEventClick,
  students
}: MonthCellProps) {
  return (
    <Droppable droppableId={`${idx}`}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundColor: snapshot.isDraggingOver ? "rgb(var(--accent) / 0.5)" : "",
            scale: snapshot.isDraggingOver ? 1.01 : 1,
          }}
          transition={{ 
            duration: 0.2,
            delay: idx * 0.01,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          onClick={() => handleDateClick(day.date)}
          className={cn(
            "min-h-[120px] p-2 bg-background/80 cursor-pointer transition-colors duration-150",
            !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
            isToday(day.date) && "bg-accent text-accent-foreground",
            holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
            holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            isToday(day.date) && "text-accent-foreground"
          )}>
            {format(day.date, "d")}
            {holiday && (
              <div className={cn(
                "text-xs truncate",
                !allowWorkOnHolidays ? "text-destructive" : "text-yellow-500"
              )}>
                {holiday.name}
                {allowWorkOnHolidays && " (Çalışmaya Açık)"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            {day.lessons.map((event, index) => (
              <MonthEventCard
                key={event.id}
                event={event}
                students={students}
                index={index}
                onClick={onEventClick}
              />
            ))}
            {provided.placeholder}
          </div>
        </motion.div>
      )}
    </Droppable>
  );
}