import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, setHours } from "date-fns";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import MonthCell from "./MonthCell";
import { getWorkingHours } from "@/utils/workingHours";
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
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

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
        return eventStart.toDateString() === dayDate.toDateString();
      })
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
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
          
          {days.map((day, idx) => (
            <MonthCell
              key={idx}
              day={day}
              idx={idx}
              isYearView={isYearView}
              allowWorkOnHolidays={allowWorkOnHolidays}
              handleDateClick={handleDateClick}
              onEventClick={onEventClick}
              students={students}
            />
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}