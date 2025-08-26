import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext } from "@hello-pangea/dnd";
import { useMonthView } from "@/features/calendar/hooks/useMonthView";
import MonthCell from "./MonthCell";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useDragDropManager } from "@/hooks/useDragDropManager";

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
  const { settings } = useUserSettings();
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const customHolidays = settings?.holidays || [];
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Use centralized drag-drop manager
  const { handleDragEnd } = useDragDropManager({
    view: 'month',
    date,
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
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {weekDays.map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.15,
                delay: index * 0.01,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="bg-background/80 p-2 text-sm font-medium text-muted-foreground text-center"
            >
              {day}
            </motion.div>
          ))}
          
          {days.map((day, idx) => (
            <MonthCell
              key={idx}
              day={day}
              idx={idx}
              handleDateClick={onDateSelect}
              onEventClick={onEventClick}
              students={students}
              allowWorkOnHolidays={allowWorkOnHolidays}
              customHolidays={customHolidays}
              workingHours={settings?.working_hours}
            />
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}