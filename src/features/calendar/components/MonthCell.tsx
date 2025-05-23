
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student, WeeklyWorkingHours } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "@/components/Calendar/MonthEventCard";
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
  workingHours: WeeklyWorkingHours;
  customHolidays: Array<{ date: string; description?: string }>;
}

export default function MonthCell({
  day,
  idx,
  holiday,
  allowWorkOnHolidays,
  handleDateClick,
  onEventClick,
  students,
  workingHours,
  customHolidays
}: MonthCellProps) {
  const dayOfWeek = day.date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const daySettings = workingHours[days[dayOfWeek]];
  const isDisabled = !daySettings?.enabled || (holiday && !allowWorkOnHolidays);

  return (
    <Droppable droppableId={`${idx}`} isDropDisabled={isDisabled}>
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
          onClick={() => !isDisabled && handleDateClick(day.date)}
          className={cn(
            "min-h-[120px] p-2 bg-background/80 transition-colors duration-150",
            !day.isCurrentMonth && "text-muted-foreground/50 bg-muted/50",
            isToday(day.date) && "bg-accent text-accent-foreground",
            holiday && !allowWorkOnHolidays && "bg-holiday text-holiday-foreground",
            holiday && allowWorkOnHolidays && "bg-working-holiday text-working-holiday-foreground",
            !daySettings?.enabled && "bg-muted",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "bg-accent/50"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            !day.isCurrentMonth && "text-muted-foreground/50",
            isToday(day.date) && "text-accent-foreground"
          )}>
            {format(day.date, "d")}
            {holiday && (
              <div className={cn(
                "text-xs truncate",
                !allowWorkOnHolidays ? "text-holiday-foreground" : "text-working-holiday-foreground"
              )}>
                {holiday.name}
                {allowWorkOnHolidays && " (Çalışmaya Açık)"}
              </div>
            )}
            {!holiday && !daySettings?.enabled && (
              <div className="text-xs text-muted-foreground truncate">
                Çalışma Saatleri Kapalı
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
