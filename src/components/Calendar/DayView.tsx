import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion, AnimatePresence } from "framer-motion";
import { TimeIndicator } from "./TimeIndicator";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import DroppableCell from "./DroppableCell";

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
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const startHour = daySettings?.enabled ? 
    parseInt(daySettings.start.split(':')[0]) : 
    9;
  const endHour = daySettings?.enabled ? 
    parseInt(daySettings.end.split(':')[0]) : 
    17;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleHourClick = (hour: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour, 0);
    
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

    onDateSelect(eventDate);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const hour = parseInt(result.destination.droppableId);
    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    const newStart = new Date(date);
    newStart.setHours(hour, 0, 0, 0);
    const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni saate taşındı.",
    });
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
                !allowWorkOnHolidays ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
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
              <DroppableCell
                id={hour.toString()}
                isDisabled={!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)}
                events={events}
                date={date}
                hour={hour}
                onCellClick={() => handleHourClick(hour)}
                className="col-span-11"
              >
                {dayEvents
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map((event, index) => (
                    <LessonCard 
                      key={event.id} 
                      event={event} 
                      onClick={onEventClick}
                      students={students}
                      index={index}
                    />
                  ))}
              </DroppableCell>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}