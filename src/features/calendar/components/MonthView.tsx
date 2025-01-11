import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useMonthView } from "../hooks/useMonthView";
import { isHoliday } from "@/utils/turkishHolidays";
import { DEFAULT_WORKING_HOURS } from "@/utils/workingHours";
import MonthCell from "./MonthCell";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useUserSettings } from "@/hooks/useUserSettings";

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
  const { settings } = useUserSettings();
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const workingHours = settings?.working_hours || DEFAULT_WORKING_HOURS;
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
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

    const holiday = isHoliday(targetDay);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
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

    // Check for lesson conflicts
    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      event.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen günde ve saatte başka bir ders bulunuyor.",
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full mx-auto"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-y divide-border">
            {weekDays.map((day, index) => (
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
      </motion.div>
    </DragDropContext>
  );
}
