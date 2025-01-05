import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "./MonthEventCard";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";
import { isDayEnabled } from "@/utils/workingHoursUtils";

interface MonthDayCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  };
  idx: number;
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
  allowWorkOnHolidays: boolean;
}

export default function MonthDayCell({
  day,
  idx,
  onDateSelect,
  onEventClick,
  students,
  allowWorkOnHolidays,
}: MonthDayCellProps) {
  const holiday = isHoliday(day.date);
  const dayEnabled = isDayEnabled(day.date);

  return (
    <Droppable droppableId={`${idx}`}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: idx * 0.01,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={() => onDateSelect(day.date)}
          className={cn(
            "min-h-[120px] p-2 bg-background/80 cursor-pointer transition-colors duration-150",
            !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
            isToday(day.date) && "bg-accent text-accent-foreground",
            holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
            holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
            snapshot.isDraggingOver && dayEnabled && "bg-accent/50",
            !dayEnabled && "bg-muted/50 text-muted-foreground cursor-not-allowed"
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
            {!dayEnabled && (
              <div className="text-xs text-muted-foreground truncate">
                Çalışmaya Kapalı
              </div>
            )}
          </div>
          <div className="space-y-1">
            {dayEnabled && day.lessons.map((event, index) => (
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