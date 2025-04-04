
import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion, AnimatePresence } from "framer-motion";
import { TimeIndicator } from "@/components/Calendar/TimeIndicator";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { cn } from "@/lib/utils";
import DayViewCell from "./DayViewCell";
import { useResizableLesson } from "@/hooks/useResizableLesson";
import { useCalendarDragDrop } from "@/hooks/useCalendarDragDrop";
import { createDateWithTime } from "@/utils/dateUtils";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: DayViewProps) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const holiday = isHoliday(date);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  const dayEvents = events.filter(event => 
    format(new Date(event.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const { handleResizeStart, isResizing, resizingEventId } = useResizableLesson({ events, onEventUpdate });
  const { handleDragStart, handleDragEnd, isDragging, draggedEventId } = useCalendarDragDrop(events, onEventUpdate);

  const startHour = daySettings?.enabled ? 
    parseInt(daySettings.start.split(':')[0]) : 
    9;
  const endHour = daySettings?.enabled ? 
    parseInt(daySettings.end.split(':')[0]) : 
    17;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleHourClick = (hour: number) => {
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const eventDate = createDateWithTime(date, hour);
    onDateSelect(eventDate);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const getNewEventTimes = (result: DropResult) => {
      if (!result.destination) return null;
      
      const [hourStr, minuteStr] = result.destination.droppableId.split(':');
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr || '0');

      if (hour < startHour || hour >= endHour) return null;

      const event = events.find(e => e.id === result.draggableId);
      if (!event) return null;

      const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
      const newStart = createDateWithTime(date, hour, minute);
      const newEnd = new Date(newStart.getTime() + duration);
      
      return { start: newStart, end: newEnd };
    };

    handleDragEnd(result, getNewEventTimes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence>
          {holiday && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "mb-4 p-2 rounded-md border",
                !allowWorkOnHolidays ? "bg-holiday text-holiday-foreground border-holiday-foreground/20" : 
                "bg-working-holiday text-working-holiday-foreground border-working-holiday-foreground/20"
              )}
            >
              {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Resmi Tatil"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {hours.map((hour, index) => (
            <motion.div 
              key={hour}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.25,
                delay: index * 0.02,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="grid grid-cols-12 gap-2"
            >
              <div className="col-span-1 text-right text-sm text-muted-foreground relative">
                {`${hour.toString().padStart(2, '0')}:00`}
                <TimeIndicator events={dayEvents} hour={hour} />
              </div>
              <DayViewCell
                hour={hour}
                events={dayEvents}
                isDraggingOver={false}
                isDisabled={!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)}
                onCellClick={() => handleHourClick(hour)}
                onEventClick={onEventClick}
                students={students}
                onEventUpdate={onEventUpdate}
                isResizing={isResizing}
                resizingEventId={resizingEventId}
                draggedEventId={draggedEventId}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}
