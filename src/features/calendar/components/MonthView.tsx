import { format, isSameMonth, isSameDay, isToday, setHours } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import MonthEventCard from "./MonthEventCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { useMonthView } from "../hooks/useMonthView";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) {
  const { toast } = useToast();
  const { getDaysInMonth } = useMonthView(date, events);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const handleDateClick = (clickedDate: Date) => {
    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    // Create a new date object without changing the month
    const dateWithSameMonth = new Date(clickedDate);
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      dateWithSameMonth.setHours(hours, minutes, 0);
      onDateSelect(dateWithSameMonth);
    } else {
      const dateWithDefaultHour = setHours(dateWithSameMonth, 9);
      onDateSelect(dateWithDefaultHour);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const targetDay = days[dayIndex].date;
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    const newStart = new Date(targetDay);
    newStart.setHours(eventStart.getHours(), eventStart.getMinutes(), 0);
    const newEnd = new Date(newStart.getTime() + duration);

    const holiday = isHoliday(targetDay);
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
            const holiday = isHoliday(day.date);
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-background/80 cursor-pointer hover:bg-accent/50 transition-colors duration-150",
                  !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
                  isToday(day.date) && "bg-accent text-accent-foreground",
                  holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
                  holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500"
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
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.15,
                delay: index * 0.01,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="bg-background/80 p-2 text-sm font-medium text-muted-foreground text-center"
            >
              {day}
            </motion.div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <Droppable droppableId={`${idx}`} key={idx}>
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
                      "min-h-[120px] p-2 bg-background/80 cursor-pointer transition-colors duration-150",
                      !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
                      isToday(day.date) && "bg-accent text-accent-foreground",
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
          })}
        </div>
      </motion.div>
    </DragDropContext>
  );
}