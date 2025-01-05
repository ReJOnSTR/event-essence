import { format, isSameMonth, isSameDay, isToday } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import MonthEventCard from "./MonthEventCard";
import MonthHeader from "./MonthHeader";
import { isHoliday } from "@/utils/turkishHolidays";
import { isDayEnabled } from "@/utils/workingHoursUtils";
import { useMonthView } from "@/features/calendar/hooks/useMonthView";

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
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const handleDateClick = (clickedDate: Date) => {
    if (!isDayEnabled(clickedDate)) {
      toast({
        title: "Çalışma saati kapalı",
        description: "Bu gün çalışmaya kapalıdır.",
        variant: "destructive"
      });
      return;
    }
    onDateSelect(clickedDate);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const targetDay = days[dayIndex].date;

    if (!isDayEnabled(targetDay)) {
      toast({
        title: "Çalışma saati kapalı",
        description: "Bu gün çalışmaya kapalıdır.",
        variant: "destructive"
      });
      return;
    }

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

  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          <MonthHeader weekDays={weekDays} />
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            const dayEnabled = isDayEnabled(day.date);
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-background/80 cursor-pointer hover:bg-accent/50 transition-colors duration-150",
                  !day.isCurrentMonth && "text-muted-foreground bg-muted/50",
                  isToday(day.date) && "bg-accent text-accent-foreground",
                  holiday && !allowWorkOnHolidays && "bg-destructive/10 text-destructive",
                  holiday && allowWorkOnHolidays && "bg-yellow-500/10 text-yellow-500",
                  !dayEnabled && "bg-muted/50 text-muted-foreground cursor-not-allowed"
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
          <MonthHeader weekDays={weekDays} />
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            const dayEnabled = isDayEnabled(day.date);
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
                      snapshot.isDraggingOver && "bg-accent/50",
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