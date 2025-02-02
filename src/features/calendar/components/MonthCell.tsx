import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, Student, WeeklyWorkingHours } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import MonthEventCard from "@/components/Calendar/MonthEventCard";
import { motion } from "framer-motion";
import { isHoliday } from "@/utils/turkishHolidays";
import { Sun, Moon, Flag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const getStatusIcon = () => {
    if (officialHoliday || customHoliday) {
      return {
        icon: <Flag className={cn(
          "h-4 w-4",
          !allowWorkOnHolidays ? "text-holiday-foreground" : "text-working-holiday-foreground"
        )} />,
        tooltip: `${officialHoliday?.name || customHoliday?.description || 'Tatil'}${allowWorkOnHolidays ? ' (Çalışmaya Açık)' : ''}`
      };
    }
    if (!daySettings?.enabled) {
      return {
        icon: <Moon className="h-4 w-4 text-muted-foreground" />,
        tooltip: "Çalışma Saatleri Kapalı"
      };
    }
    return {
      icon: <Sun className="h-4 w-4 text-green-500" />,
      tooltip: `Çalışma Saatleri: ${daySettings?.start} - ${daySettings?.end}`
    };
  };

  const status = getStatusIcon();

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
            officialHoliday && !allowWorkOnHolidays && "bg-holiday",
            officialHoliday && allowWorkOnHolidays && "bg-working-holiday",
            !daySettings?.enabled && "bg-muted",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-accent/50",
            snapshot.isDraggingOver && !isDisabled && "bg-accent/50"
          )}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={cn(
              "text-sm font-medium",
              !day.isCurrentMonth && "text-muted-foreground/50",
              isToday(day.date) && "text-accent-foreground"
            )}>
              {format(day.date, "d")}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-0.5 rounded-full hover:bg-accent/50 transition-colors">
                    {status.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{status.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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