import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { startOfWeek, addDays } from "date-fns";
import { motion } from "framer-motion";
import { getWorkingHours } from "@/utils/workingHours";
import WeekViewHeader from "./WeekViewHeader";
import WeekViewTimeGrid from "./WeekViewTimeGrid";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: WeekViewProps) {
  const workingHours = getWorkingHours();
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0])));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <motion.div 
      className="w-full overflow-x-auto bg-background border border-border rounded-lg"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <WeekViewHeader date={date} />
      <div className="grid grid-cols-8 gap-px bg-border">
        <WeekViewTimeGrid
          weekDays={weekDays}
          hours={hours}
          events={events}
          workingHours={workingHours}
          allowWorkOnHolidays={allowWorkOnHolidays}
          onCellClick={(day, hour) => {
            const eventDate = new Date(day);
            eventDate.setHours(hour);
            onDateSelect(eventDate);
          }}
          onEventClick={onEventClick}
          onEventUpdate={onEventUpdate}
          students={students}
        />
      </div>
    </motion.div>
  );
}
