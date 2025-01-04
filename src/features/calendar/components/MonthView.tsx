import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMonthView } from "../hooks/useMonthView";
import { isHoliday } from "@/utils/turkishHolidays";
import MonthHeader from "./MonthHeader";
import MonthCell from "./MonthCell";
import { useToast } from "@/components/ui/use-toast";

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
  const { getDaysInMonth, handleDateClick, allowWorkOnHolidays } = useMonthView(date, events);
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

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

  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          <MonthHeader days={weekDays} />
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <MonthCell
                key={idx}
                day={day}
                idx={idx}
                holiday={holiday}
                allowWorkOnHolidays={allowWorkOnHolidays}
                handleDateClick={onDateSelect}
                onEventClick={onEventClick}
                students={students}
              />
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
          <MonthHeader days={weekDays} />
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <MonthCell
                key={idx}
                day={day}
                idx={idx}
                holiday={holiday}
                allowWorkOnHolidays={allowWorkOnHolidays}
                handleDateClick={(date) => {
                  const validDate = handleDateClick(date);
                  if (validDate) onDateSelect(validDate);
                }}
                onEventClick={onEventClick}
                students={students}
              />
            );
          })}
        </div>
      </motion.div>
    </DragDropContext>
  );
}