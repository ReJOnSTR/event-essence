import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import MonthEventCard from "./MonthEventCard";
import { isHoliday } from "@/utils/turkishHolidays";

interface MonthCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  };
  idx: number;
  isYearView?: boolean;
  allowWorkOnHolidays: boolean;
  handleDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthCell({
  day,
  idx,
  isYearView = false,
  allowWorkOnHolidays,
  handleDateClick,
  onEventClick,
  students
}: MonthCellProps) {
  const holiday = isHoliday(day.date);

  if (isYearView) {
    return (
      <div
        onClick={() => handleDateClick(day.date)}
        className={cn(
          "min-h-[40px] p-1 cursor-pointer transition-colors duration-150",
          "bg-background/80 hover:bg-accent/50",
          !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
          isToday(day.date) && "!bg-[#eff6ff] dark:!bg-[#354c5a]",
          holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
          holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500"
        )}
      >
        <div className="text-xs font-medium">
          {format(day.date, "d")}
        </div>
      </div>
    );
  }

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
            "min-h-[120px] p-2 cursor-pointer transition-colors duration-150",
            "bg-background/80",
            !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
            isToday(day.date) && "!bg-[#eff6ff] dark:!bg-[#354c5a]",
            holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
            holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
            snapshot.isDraggingOver && "bg-accent/50"
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