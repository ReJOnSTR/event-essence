import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday, setHours, setMinutes, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { motion, AnimatePresence } from "framer-motion";
import { TimeIndicator } from "./TimeIndicator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useMobileDragDrop } from "@/hooks/useMobileDragDrop";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useEnhancedDragDrop } from "@/hooks/useEnhancedDragDrop";

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
  const { settings } = useUserSettings();
  const workingHours = getWorkingHours();
  const customHolidays = settings?.holidays || [];
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  
  const holiday = isHoliday(date, customHolidays);
  
  const { draggedEvent, handleTouchStart, handleTouchEnd } = useMobileDragDrop(onEventUpdate);
  
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

  const handleHourClick = (hour: number, minute: number) => {
    if (draggedEvent) {
      handleTouchEnd(hour, minute);
      return;
    }

    const eventDate = new Date(date);
    eventDate.setHours(hour, minute);
    
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil Günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
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

    const currentTime = `${hour}:00`;
    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    onDateSelect(eventDate);
  };

  const { handleDragEnd } = useEnhancedDragDrop({ events, onEventUpdate });

  const onDragEnd = (result: DropResult) => {
    const getNewEventTimes = (result: DropResult) => {
      if (!result.destination) return null;
      
      const [hourStr, minuteStr] = result.destination.droppableId.split(':');
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      if (hour < startHour || hour >= endHour) {
        return null;
      }

      const event = events.find(e => e.id === result.draggableId);
      if (!event) return null;

      const duration = differenceInMinutes(event.end, event.start);
      const newStart = setMinutes(setHours(date, hour), minute);
      const newEnd = new Date(newStart.getTime() + duration * 60000);

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
                !allowWorkOnHolidays ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}
            >
              {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Tatil"}
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
              <Droppable droppableId={`${hour}:0`}>
                {(provided, snapshot) => (
                  <motion.div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative transition-all duration-200",
                      draggedEvent && "bg-accent/30",
                      (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                      "bg-muted cursor-not-allowed"
                    )}
                    animate={{
                      backgroundColor: snapshot.isDraggingOver && daySettings?.enabled ? 
                        "hsl(var(--accent) / 0.25)" : 
                        draggedEvent ? "hsl(var(--accent) / 0.15)" : "transparent",
                      borderColor: snapshot.isDraggingOver ? "hsl(var(--accent))" : "hsl(var(--border))",
                      scale: snapshot.isDraggingOver ? 1.002 : 1
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                    onClick={() => handleHourClick(hour, 0)}
                  >
                    {snapshot.isDraggingOver && daySettings?.enabled && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/20 to-accent/10 animate-pulse" />
                      </motion.div>
                    )}
                    {dayEvents
                      .filter(event => new Date(event.start).getHours() === hour)
                      .map((event, index) => (
                        <LessonCard 
                          key={event.id} 
                          event={event} 
                          onClick={onEventClick}
                          students={students}
                          index={index}
                          onTouchStart={(e) => handleTouchStart(event, e)}
                        />
                      ))}
                    {provided.placeholder}
                  </motion.div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}