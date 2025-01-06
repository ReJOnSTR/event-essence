import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";
import { useMonthView } from "../../../hooks/useMonthView";
import MonthCell from "./MonthCell";
import MonthHeader from "./MonthHeader";
import { useMonthDragDrop } from "./useMonthDragDrop";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) {
  const { getDaysInMonth } = useMonthView(date, events);
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const { onDragEnd } = useMonthDragDrop(days, events, allowWorkOnHolidays, onEventUpdate);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                allowWorkOnHolidays={allowWorkOnHolidays}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </DragDropContext>
  );
}