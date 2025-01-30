import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student, WeeklyWorkingHours } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "@/components/Calendar/MonthEventCard";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";
import DayStatusIcons from "./DayStatusIcons";

interface MonthCellProps {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  };
  idx: number;
  handleDateClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
  allowWorkOnHolidays: boolean;
  customHolidays: Array<{ date: string; description?: string }>;
  workingHours?: WeeklyWorkingHours;
}

export default function MonthCell({
  day,
  idx,
  handleDateClick,
  onEventClick,
  students,
  allowWorkOnHolidays,
  customHolidays,
  workingHours
}: MonthCellProps) {
  const dayOfWeek = day.date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const daySettings = workingHours?.[days[dayOfWeek]];
  
  const officialHoliday = isHoliday(day.date);
  const customHoliday = customHolidays.find(holiday => 
    new Date(holiday.date).toDateString() === day.date.toDateString()
  );
  
  const isDisabled = !daySettings?.enabled || 
    ((officialHoliday || customHoliday) && !allowWorkOnHolidays);

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
            (officialHoliday || customHoliday) && !allowWorkOnHolidays && "bg-destructive/10",
            (officialHoliday || customHoliday) && allowWorkOnHolidays && "bg-yellow-500/10",
            !daySettings?.enabled && "bg-muted",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "bg-accent/50"
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={cn(
              "text-sm font-medium",
              !day.isCurrentMonth && "text-muted-foreground/50",
              isToday(day.date) && "text-accent-foreground"
            )}>
              {format(day.date, "d")}
            </span>
            <DayStatusIcons
              isHoliday={!!officialHoliday}
              isCustomHoliday={!!customHoliday}
              allowWorkOnHolidays={allowWorkOnHolidays}
              isWorkingDay={!!daySettings?.enabled}
              className="ml-auto"
            />
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