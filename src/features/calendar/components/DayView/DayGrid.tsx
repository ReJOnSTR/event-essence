import { motion } from "framer-motion";
import { CalendarEvent, Student } from "@/types/calendar";
import DayHeader from "./DayHeader";
import DayCell from "./DayCell";

interface DayGridProps {
  hours: number[];
  events: CalendarEvent[];
  isDisabled: (hour: number) => boolean;
  onCellClick: (hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayGrid({
  hours,
  events,
  isDisabled,
  onCellClick,
  onEventClick,
  students
}: DayGridProps) {
  return (
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
          <DayCell
            hour={hour}
            events={events}
            isDisabled={isDisabled(hour)}
            onCellClick={() => onCellClick(hour)}
            onEventClick={onEventClick}
            students={students}
          />
        </motion.div>
      ))}
    </div>
  );
}