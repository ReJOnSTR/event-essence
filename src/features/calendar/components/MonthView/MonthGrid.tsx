import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import MonthCell from "./MonthCell";
import MonthHeader from "./MonthHeader";
import { useMonthDragDrop } from "../../hooks/useMonthDragDrop";

interface MonthGridProps {
  days: {
    date: Date;
    isCurrentMonth: boolean;
    lessons: CalendarEvent[];
  }[];
  weekDays: string[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
  events: CalendarEvent[];
}

export default function MonthGrid({
  days,
  weekDays,
  onDateSelect,
  onEventClick,
  onEventUpdate,
  students,
  events
}: MonthGridProps) {
  const { handleDragEnd } = useMonthDragDrop({
    days,
    events,
    onEventUpdate
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div 
        className="w-full mx-auto"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-y divide-border">
            <MonthHeader weekDays={weekDays} />
            
            {days.map((day, idx) => (
              <MonthCell
                key={idx}
                day={day}
                idx={idx}
                handleDateClick={onDateSelect}
                onEventClick={onEventClick}
                students={students}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </DragDropContext>
  );
}