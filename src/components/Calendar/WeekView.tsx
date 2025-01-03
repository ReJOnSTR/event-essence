import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion } from "framer-motion";

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
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0})));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleCellClick = (day: Date, hour: number) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(day);

    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const dayStartHour = parseInt(daySettings.start.split(':')[0]);
    const dayEndHour = parseInt(daySettings.end.split(':')[0]);

    if (hour < dayStartHour || hour >= dayEndHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  const getTimeIndicator = (hour: number, dayEvents: CalendarEvent[]) => {
    const hourEvents = dayEvents.filter(event => {
      const eventHour = new Date(event.start).getHours();
      const eventEndHour = new Date(event.end).getHours();
      const eventEndMinutes = new Date(event.end).getMinutes();
      return eventHour === hour && (eventEndHour > hour || (eventEndHour === hour && eventEndMinutes > 0));
    });

    if (hourEvents.length === 0) return null;

    return hourEvents.map(event => {
      const startMinutes = new Date(event.start).getMinutes();
      const endHour = new Date(event.end).getHours();
      const endMinutes = new Date(event.end).getMinutes();
      
      // Eğer ders aynı saat dilimi içinde bitiyorsa
      if (endHour === hour) {
        return (
          <div key={event.id} className="absolute left-0 h-4 flex items-center text-xs text-gray-500">
            <div className="w-1 h-full bg-gray-300 mr-1" style={{
              height: `${(endMinutes / 60) * 100}%`
            }} />
            {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
          </div>
        );
      }
      
      // Eğer ders sonraki saate taşıyorsa
      return (
        <div key={event.id} className="absolute left-0 h-4 flex items-center text-xs text-gray-500">
          <div className="w-1 h-full bg-gray-300 mr-1" style={{
            height: "100%"
          }} />
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </div>
      );
    });
  };

  return (
    <motion.div 
      className="w-full overflow-x-auto"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-white w-16" />
        {weekDays.map((day, index) => {
          const holiday = isHoliday(day);
          return (
            <motion.div
              key={day.toString()}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.25,
                delay: index * 0.02,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={cn(
                "bg-white p-2 text-center",
                isToday(day) && "text-calendar-blue"
              )}
            >
              <div className="font-medium">
                {format(day, "EEEE", { locale: tr })}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, "d MMM", { locale: tr })}
              </div>
              {holiday && (
                <div className="text-xs text-gray-500">
                  {holiday.name}
                </div>
              )}
            </motion.div>
          );
        })}

        {hours.map((hour, hourIndex) => (
          <React.Fragment key={`hour-${hour}`}>
            <div className="bg-white p-2 text-right text-sm text-gray-500 relative">
              {`${hour.toString().padStart(2, '0')}:00`}
              {getTimeIndicator(hour, events.filter(event => 
                format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              ))}
            </div>
            {weekDays.map((day) => {
              const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
              const daySettings = workingHours[dayOfWeek];
              const isDayEnabled = daySettings?.enabled;
              const holiday = isHoliday(day);
              const isWorkDisabled = (holiday && !allowWorkOnHolidays) || !isDayEnabled;
              const isHourInRange = isDayEnabled && 
                hour >= parseInt(daySettings.start.split(':')[0]) && 
                hour < parseInt(daySettings.end.split(':')[0]);

              return (
                <div
                  key={`${day}-${hour}`}
                  className={cn(
                    "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 relative",
                    isToday(day) && "bg-blue-50",
                    (isWorkDisabled || !isHourInRange) && "bg-gray-100 cursor-not-allowed"
                  )}
                  onClick={() => handleCellClick(day, hour)}
                >
                  {events
                    .filter(
                      event =>
                        format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                        new Date(event.start).getHours() === hour
                    )
                    .map(event => (
                      <LessonCard 
                        key={event.id} 
                        event={event} 
                        onClick={onEventClick}
                        students={students}
                      />
                    ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}
