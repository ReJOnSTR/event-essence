
import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { motion } from "framer-motion";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { useMonthView } from "@/features/calendar/hooks/useMonthView";
import MonthCell from "./MonthCell";
import { useUserSettings } from "@/hooks/useUserSettings";
import { isHoliday } from "@/utils/turkishHolidays";

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
  const { toast } = useToast();
  const { getDaysInMonth } = useMonthView(date, events);
  const { settings } = useUserSettings();
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const customHolidays = settings?.holidays || [];
  const days = getDaysInMonth(date);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const targetDay = days[dayIndex].date;
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const dayOfWeek = targetDay.getDay();
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = settings?.working_hours?.[weekDays[dayOfWeek]];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const isCustomHoliday = customHolidays.some(holiday => 
      new Date(holiday.date).toDateString() === targetDay.toDateString()
    );

    if (isCustomHoliday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: "Bu gün özel tatil günü olarak işaretlenmiş.",
        variant: "destructive"
      });
      return;
    }

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    const newStart = new Date(targetDay);
    newStart.setHours(eventStart.getHours(), eventStart.getMinutes(), 0);
    const newEnd = new Date(newStart.getTime() + duration);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni güne taşındı.",
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full mx-auto pb-6"
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
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date, customHolidays);
            return (
              <MonthCell
                key={idx}
                day={day}
                idx={idx}
                holiday={holiday}
                handleDateClick={onDateSelect}
                onEventClick={onEventClick}
                students={students}
                allowWorkOnHolidays={allowWorkOnHolidays}
                workingHours={settings?.working_hours || {
                  monday: { start: "09:00", end: "17:00", enabled: true },
                  tuesday: { start: "09:00", end: "17:00", enabled: true },
                  wednesday: { start: "09:00", end: "17:00", enabled: true },
                  thursday: { start: "09:00", end: "17:00", enabled: true },
                  friday: { start: "09:00", end: "17:00", enabled: true },
                  saturday: { start: "09:00", end: "17:00", enabled: false },
                  sunday: { start: "09:00", end: "17:00", enabled: false },
                }}
                customHolidays={customHolidays}
              />
            );
          })}
        </div>
      </motion.div>
    </DragDropContext>
  );
}
