
import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { startOfWeek, addDays } from "date-fns";
import { motion } from "framer-motion";
import WeekViewHeader from "./WeekViewHeader";
import WeekViewTimeGrid from "./WeekViewTimeGrid";
import { useUserSettings } from "@/hooks/useUserSettings";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Always initialize these variables, don't return early
  const workingHours = settings?.working_hours || {
    monday: { start: "09:00", end: "17:00", enabled: true },
    tuesday: { start: "09:00", end: "17:00", enabled: true },
    wednesday: { start: "09:00", end: "17:00", enabled: true },
    thursday: { start: "09:00", end: "17:00", enabled: true },
    friday: { start: "09:00", end: "17:00", enabled: true },
    saturday: { start: "09:00", end: "17:00", enabled: false },
    sunday: { start: "09:00", end: "17:00", enabled: false }
  };

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])) || [9]);
    
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0])) || [17]);

  const hours = Array.from(
    { length: endHour - startHour + 1 }, 
    (_, i) => startHour + i
  );

  const handleCellClick = (day: Date, hour: number) => {
    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <motion.div 
      className="w-full h-[calc(100vh-12rem)] flex flex-col"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="border border-border rounded-lg flex flex-col h-full">
        <WeekViewHeader date={date} />
        <ScrollArea className="flex-1 h-[calc(100%-3rem)]">
          <div className="grid grid-cols-8 divide-x divide-border min-w-[800px]">
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
        </ScrollArea>
      </div>
    </motion.div>
  );
}
