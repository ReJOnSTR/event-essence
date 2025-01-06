import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";
import { useCalendarLogic } from "@/features/calendar/hooks/useCalendarLogic";
import { useDragDrop } from "@/features/calendar/hooks/useDragDrop";
import DayViewHeader from "./DayViewHeader";
import DayViewGrid from "./DayViewGrid";
import { isHoliday } from "@/utils/turkishHolidays";

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
  const { checkDateAvailability, getWorkingHoursForDay, allowWorkOnHolidays } = useCalendarLogic();
  const holiday = isHoliday(date);
  
  const workingHours = getWorkingHoursForDay(date);
  const startHour = workingHours?.startHour ?? 9;
  const endHour = workingHours?.endHour ?? 17;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const handleHourClick = (hour: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour, 0);
    if (checkDateAvailability(eventDate, hour)) {
      onDateSelect(eventDate);
    }
  };

  const { handleDragEnd } = useDragDrop(events, onEventUpdate);

  const isHourDisabled = (hour: number) => {
    return !workingHours || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays);
  };

  return (
    <DragDropContext 
      onDragEnd={(result) => 
        handleDragEnd(result, (result) => {
          const [hourStr, minuteStr] = result.destination?.droppableId.split(':') ?? [];
          const hour = parseInt(hourStr);
          const minute = parseInt(minuteStr);
          
          if (isNaN(hour) || isNaN(minute)) return null;
          
          const newStart = new Date(date);
          newStart.setHours(hour, minute);
          const event = events.find(e => e.id === result.draggableId);
          if (!event) return null;
          
          const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
          const newEnd = new Date(newStart.getTime() + duration);
          
          return { start: newStart, end: newEnd };
        })
      }
    >
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <DayViewHeader
          date={date}
          holiday={holiday}
          allowWorkOnHolidays={allowWorkOnHolidays}
        />

        <DayViewGrid
          hours={hours}
          events={dayEvents}
          onHourClick={handleHourClick}
          isHourDisabled={isHourDisabled}
          students={students}
          onEventClick={onEventClick}
          allowWorkOnHolidays={allowWorkOnHolidays}
        />
      </motion.div>
    </DragDropContext>
  );
}