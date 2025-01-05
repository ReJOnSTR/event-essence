import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import MonthDayCell from "./MonthDayCell";
import MonthHeader from "./MonthHeader";
import { useMonthView } from "@/features/calendar/hooks/useMonthView";
import { isDayEnabled } from "@/utils/workingHoursUtils";
import { isHoliday } from "@/utils/turkishHolidays";

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

  const handleDateSelect = (selectedDate: Date) => {
    if (!isDayEnabled(selectedDate)) {
      toast({
        title: "Çalışma saati kapalı",
        description: "Bu gün çalışmaya kapalıdır.",
        variant: "destructive"
      });
      return;
    }
    onDateSelect(selectedDate);
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
            const dayEnabled = isDayEnabled(day.date);
            const holiday = isHoliday(day.date);
            return (
              <div
                key={idx}
                onClick={() => handleDateSelect(day.date)}
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
                  {!dayEnabled && (
                    <div className="text-[10px] text-muted-foreground truncate">
                      Kapalı
                    </div>
                  )}
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
          {days.map((day, idx) => (
            <MonthDayCell
              key={idx}
              day={day}
              idx={idx}
              onDateSelect={handleDateSelect}
              onEventClick={onEventClick}
              students={students}
              allowWorkOnHolidays={allowWorkOnHolidays}
            />
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}