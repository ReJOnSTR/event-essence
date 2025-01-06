import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import MonthCell from "./MonthCell";
import MonthHeader from "./MonthHeader";
import { useMonthDragDrop } from "../../hooks/useMonthDragDrop";
import { useMonthView } from "../../hooks/useMonthView";

interface MonthGridProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthGrid({
  events,
  onDateSelect,
  date,
  onEventClick,
  onEventUpdate,
  students
}: MonthGridProps) {
  const { getDaysInMonth } = useMonthView(date, events);
  const { handleDragEnd } = useMonthDragDrop(events, onEventUpdate);
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

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
                allowWorkOnHolidays={allowWorkOnHolidays}
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