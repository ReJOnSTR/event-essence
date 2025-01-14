import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday, setHours } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import MonthEventCard from "@/components/Calendar/MonthEventCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";
import { memo } from "react";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

const MonthView = memo(({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) => {
  const { toast } = useToast();
  const { settings } = useUserSettings();
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const customHolidays = settings?.holidays || [];
  const workingHours = getWorkingHours();

  const getDaysInMonth = (currentDate: Date) => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay() - 1;
    const suffixDays = Array.from({ length: endDay === -1 ? 0 : 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(dayDate => ({
      date: dayDate,
      isCurrentMonth: isSameMonth(dayDate, currentDate),
      lessons: events.filter(event => {
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, dayDate);
      })
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[days[dayOfWeek]];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const holiday = isHoliday(clickedDate, customHolidays);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      const dateWithWorkingHours = new Date(clickedDate);
      dateWithWorkingHours.setHours(hours, minutes, 0);
      onDateSelect(dateWithWorkingHours);
    } else {
      const dateWithDefaultHour = setHours(clickedDate, 9);
      onDateSelect(dateWithDefaultHour);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const days = getDaysInMonth(date);
    const targetDay = days[dayIndex].date;
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const dayOfWeek = targetDay.getDay();
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[weekDays[dayOfWeek]];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    const newStart = new Date(targetDay);
    newStart.setHours(eventStart.getHours(), eventStart.getMinutes(), 0);
    const newEnd = new Date(newStart.getTime() + duration);

    const holiday = isHoliday(targetDay, customHolidays);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni güne taşındı.",
    });
  };

  const days = getDaysInMonth(date);

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[days[dayOfWeek]];
    const holiday = isHoliday(date, customHolidays);

    return (!daySettings?.enabled || (holiday && !allowWorkOnHolidays));
  };

  const renderDayCell = (day: typeof days[0], idx: number) => {
    const holiday = isHoliday(day.date, customHolidays);
    const isDisabled = isDateDisabled(day.date);

    return (
      <Droppable droppableId={`${idx}`} key={idx}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={() => !isDisabled && handleDateClick(day.date)}
            className={cn(
              "min-h-[120px] p-2 bg-background/80 transition-colors duration-150",
              !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
              isToday(day.date) && "bg-accent text-accent-foreground",
              holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
              holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
              snapshot.isDraggingOver && "bg-accent/50",
              isDisabled ? "cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent/50"
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
              {!holiday && !workingHours[['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day.date.getDay()]]?.enabled && (
                <div className="text-xs text-muted-foreground truncate">
                  Çalışma Saatleri Kapalı
                </div>
              )}
            </div>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {day.lessons.map((event, index) => (
                  <MonthEventCard
                    key={event.id}
                    event={event}
                    students={students}
                    index={index}
                    onClick={onEventClick}
                  />
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          </motion.div>
        )}
      </Droppable>
    );
  };

  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div
              key={day}
              className="bg-background/80 p-1 text-xs font-medium text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date, customHolidays);
            const isDisabled = isDateDisabled(day.date);
            return (
              <div
                key={idx}
                onClick={() => !isDisabled && handleDateClick(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-background/80 transition-colors duration-150",
                  !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
                  isToday(day.date) && "bg-accent text-accent-foreground",
                  holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
                  holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
                  isDisabled ? "cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent/50"
                )}
              >
                <div className="text-xs font-medium">
                  {format(day.date, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full mx-auto"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
            <motion.div
              key={day}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="bg-background/80 p-2 text-sm font-medium text-muted-foreground text-center"
            >
              {day}
            </motion.div>
          ))}
          
          {days.map(renderDayCell)}
        </div>
      </motion.div>
    </DragDropContext>
  );
});

MonthView.displayName = "MonthView";

export default MonthView;