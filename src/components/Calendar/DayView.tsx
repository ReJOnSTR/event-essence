// Fixed: Removed useMobileDragDrop and using centralized drag-drop manager
import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { motion, AnimatePresence } from "framer-motion";
import { TimeIndicator } from "./TimeIndicator";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useDragDropManager } from "@/hooks/useDragDropManager";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";

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

  // Use centralized drag-drop manager
  const { handleDragEnd } = useDragDropManager({
    view: 'day',
    date,
    events,
    onEventUpdate
  });

  const handleHourClick = (hour: number, minute: number) => {
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative transition-colors",
                      snapshot.isDraggingOver && "bg-primary/10 ring-2 ring-primary/20",
                      (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                      "bg-muted cursor-not-allowed"
                    )}
                    onClick={() => handleHourClick(hour, 0)}
                  >
                    <AnimatePresence>
                      {snapshot.isDraggingOver && (
                        <motion.div 
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="h-full w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}