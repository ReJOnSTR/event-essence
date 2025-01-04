import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
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
  holiday: any;
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.15,
            delay: idx * 0.01,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={() => handleDateClick(day.date)}
          className={cn(
            "min-h-[120px] p-2 bg-background cursor-pointer transition-colors duration-150",
            !day.isCurrentMonth && "bg-muted text-muted-foreground",
            isToday(day.date) && "bg-primary/5",
            holiday && !allowWorkOnHolidays && "bg-destructive/10",
            holiday && allowWorkOnHolidays && "bg-yellow-500/10 dark:bg-yellow-400/10",
            snapshot.isDraggingOver && "bg-primary/5"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            isToday(day.date) && "text-calendar-blue dark:text-calendar-blue-dark",
            holiday && !allowWorkOnHolidays && "text-destructive",
            holiday && allowWorkOnHolidays && "text-yellow-700 dark:text-yellow-400"
          )}>
            {format(day.date, "d")}
            {holiday && (
              <div className={cn(
                "text-xs truncate",
                !allowWorkOnHolidays ? "text-destructive" : "text-yellow-700 dark:text-yellow-400"
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