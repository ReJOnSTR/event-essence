import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useDayView } from "../../hooks/useDayView";
import DayGrid from "./DayGrid";
import { checkLessonConflict } from "@/utils/lessonConflict";

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
    isHourDisabled, 
    handleHourClick, 
    startHour, 
    endHour 
  } = useDayView(date);

  const hours = Array.from(
    { length: endHour - startHour + 1 }, 
    (_, i) => startHour + i
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [hourStr] = result.destination.droppableId.split(':');
    const hour = parseInt(hourStr);

    if (isHourDisabled(hour)) {
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
    newStart.setHours(hour, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <DayGrid
          hours={hours}
          events={events}
          isDisabled={isHourDisabled}
          onCellClick={(hour) => handleHourClick(hour, onDateSelect)}
          onEventClick={onEventClick}
          students={students}
        />
      </motion.div>
    </DragDropContext>
  );
}