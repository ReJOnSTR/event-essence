import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student, WeeklyWorkingHours } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "@/components/Calendar/MonthEventCard";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";
import { Sun, Moon, Flag } from "lucide-react";

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

  const getHolidayInfo = () => {
    if (customHoliday) {
      return {
        name: customHoliday.description || "Özel Tatil",
        isCustom: true
      };
    }
    if (officialHoliday) {
      return {
        name: officialHoliday.name,
        isCustom: false
      };
    }
    return null;
  };

  const holidayInfo = getHolidayInfo();

  return (
    <Droppable droppableId={`${idx}`} isDropDisabled={isDisabled}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.droppableProps}
          initial={{ opacity: 0, y: -4 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundColor: snapshot.isDraggingOver && !isDisabled ? 
              "hsl(var(--accent) / 0.3)" : 
              isToday(day.date) ? "hsl(var(--accent) / 0.15)" : 
              "hsl(var(--background) / 0.8)",
            scale: snapshot.isDraggingOver ? 1.005 : 1
          }}
          transition={{ 
            duration: 0.2,
            delay: idx * 0.005,
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={() => !isDisabled && handleDateClick(day.date)}
          className={cn(
            "min-h-[120px] p-2 transition-all duration-200 relative",
            !day.isCurrentMonth && "text-muted-foreground/50 bg-muted/50",
            holidayInfo && !allowWorkOnHolidays && "bg-destructive/10",
            holidayInfo && allowWorkOnHolidays && "bg-yellow-500/10",
            !daySettings?.enabled && "bg-muted",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/30"
          )}
        >
          <div className={cn(
            "flex items-center justify-between mb-1",
            !day.isCurrentMonth && "text-muted-foreground/50",
            isToday(day.date) && "text-accent-foreground"
          )}>
            <span className="text-sm font-medium">{format(day.date, "d")}</span>
            <div className="flex items-center gap-1">
              {holidayInfo && (
                <Flag className={cn(
                  "h-4 w-4",
                  !allowWorkOnHolidays ? "text-destructive" : "text-yellow-500"
                )} />
              )}
              {!holidayInfo && (
                daySettings?.enabled ? (
                  <Sun className="h-4 w-4 text-green-500" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )
              )}
            </div>
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