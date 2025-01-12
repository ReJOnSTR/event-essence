import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { startOfWeek, addDays } from "date-fns";
import { motion } from "framer-motion";
import WeekViewHeader from "./WeekViewHeader";
import WeekViewTimeGrid from "./WeekViewTimeGrid";
import { useUserSettings } from "@/hooks/useUserSettings";
import { DEFAULT_WORKING_HOURS } from "@/utils/workingHours";

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
  const { settings } = useUserSettings();
  const workingHours = settings?.working_hours || DEFAULT_WORKING_HOURS;
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0])));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleCellClick = (day: Date, hour: number) => {
    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <motion.div 
      className="w-full overflow-x-auto"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="border border-border rounded-lg overflow-hidden">
        <WeekViewHeader date={date} />
        <div className="grid grid-cols-8 divide-x divide-border">
          <WeekViewTimeGrid
            weekDays={weekDays}
            hours={hours}
            events={events}
            workingHours={workingHours}
            allowWorkOnHolidays={settings?.allow_work_on_holidays ?? true}
            onCellClick={handleCellClick}
            onEventClick={onEventClick}
            onEventUpdate={onEventUpdate}
            students={students}
          />
        </div>
      </div>
    </motion.div>
  );
}