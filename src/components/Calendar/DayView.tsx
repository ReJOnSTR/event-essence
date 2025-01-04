import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useDayView } from "@/hooks/useDayView";
import DayHeader from "./DayHeader";
import DayTimeSlot from "./DayTimeSlot";
import { TimeIndicator } from "./TimeIndicator";

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
  const {
    dayEvents,
    hours,
    startHour,
    endHour,
    daySettings,
    holiday,
    allowWorkOnHolidays,
    handleHourClick
  } = useDayView(date, events);

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

    const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
    const newStart = new Date(date);
    newStart.setHours(hour, minute);
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
              <DayHeader hour={hour} />
              <DayTimeSlot
                hour={hour}
                dayEvents={dayEvents}
                isDraggingOver={false}
                isDisabled={!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)}
                onClick={() => {
                  const newDate = handleHourClick(hour, 0);
                  if (newDate) onDateSelect(newDate);
                }}
                students={students}
                onEventClick={onEventClick}
                droppableId={`${hour}:0`}
              />
              <TimeIndicator events={dayEvents} hour={hour} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}