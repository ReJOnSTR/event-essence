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
  
  const holiday = isHoliday(day.date, customHolidays);
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
            "min-h-[120px] p-2 bg-background/80 transition-colors duration-150 relative",
            !day.isCurrentMonth && "text-muted-foreground/50 bg-muted/50",
            isToday(day.date) && "bg-accent text-accent-foreground",
            holiday && !allowWorkOnHolidays && "bg-holiday",
            holiday && allowWorkOnHolidays && "bg-working-holiday",
            !daySettings?.enabled && "bg-non-working",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "bg-accent/50"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">
              {format(day.date, "d")}
            </div>
            <DayStatusIcons 
              isHoliday={holiday && !allowWorkOnHolidays}
              isWorkingHoliday={holiday && allowWorkOnHolidays}
              isNonWorkingDay={!daySettings?.enabled}
              holidayName={holiday?.name}
              className="static flex gap-0.5"
            />
          </div>

          <div className="space-y-1 mt-2">
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