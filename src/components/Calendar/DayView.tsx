
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
import { useResizableLesson } from "@/hooks/useResizableLesson";

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
  
  const { draggedEvent, handleTouchStart, handleTouchEnd, isDragging, controls } = useMobileDragDrop(onEventUpdate);
  const { handleResizeStart, isResizing, resizeControls } = useResizableLesson({ events, onEventUpdate });
  
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [hourStr, minuteStr] = result.destination.droppableId.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    const duration = differenceInMinutes(event.end, event.start);
    const newStart = setMinutes(setHours(date, hour), minute);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      event.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
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
      description: "Ders başarıyla yeni saate taşındı.",
    });
  };

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.05
      }
    }
  };

  const hourVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 100 
      }
    }
  };

  const holidayVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 120 
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const cellVariants = {
    initial: { backgroundColor: "var(--background)" },
    hover: { backgroundColor: "var(--accent)", transition: { duration: 0.2 } },
    draggingOver: { 
      backgroundColor: "var(--accent)",
      scale: 1.01,
      transition: { duration: 0.2 }
    },
    disabled: { backgroundColor: "var(--muted)" }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {holiday && (
            <motion.div 
              variants={holidayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "mb-4 p-2 rounded-md border",
                !allowWorkOnHolidays ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}
              layout
            >
              {holiday.name} - {allowWorkOnHolidays ? "Çalışmaya Açık Tatil" : "Tatil"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {hours.map((hour, index) => (
            <motion.div 
              key={hour}
              variants={hourVariants}
              custom={index}
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
                      "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative",
                      isDragging && "bg-accent/50",
                      isResizing && "bg-accent/30",
                      (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                      "bg-muted cursor-not-allowed"
                    )}
                    onClick={() => handleHourClick(hour, 0)}
                    variants={cellVariants}
                    initial="initial"
                    whileHover={(!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) ? "disabled" : "hover"}
                    animate={snapshot.isDraggingOver ? "draggingOver" : "initial"}
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
                          onTouchStart={(e) => handleTouchStart(event, e)}
                          onResizeStart={handleResizeStart}
                          isResizable={true}
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
