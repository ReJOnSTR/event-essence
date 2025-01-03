import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday, setHours } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import MonthEventCard from "./MonthEventCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion } from "framer-motion";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  students
}: MonthViewProps) {
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const getDaysInMonth = (currentDate: Date): DayCell[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Adjust for Monday start
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6; // Sunday becomes last day
    
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay() - 1;
    const suffixDays = Array.from({ length: endDay === -1 ? 0 : 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(dayDate => ({
      date: dayDate,
      isCurrentMonth: isSameMonth(dayDate, currentDate),
      lessons: events.filter(event => isSameDay(event.start, dayDate))
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const holiday = isHoliday(clickedDate);
    if (holiday && !allowWorkOnHolidays) {
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      const dateWithWorkingHours = new Date(clickedDate);
      dateWithWorkingHours.setHours(hours, minutes, 0);
      onDateSelect(dateWithWorkingHours);
    } else {
      // If the day is not enabled in working hours, use 9 AM as default
      const dateWithDefaultHour = setHours(clickedDate, 9);
      onDateSelect(dateWithDefaultHour);
    }
  };

  const days = getDaysInMonth(date);

  // Yıllık görünümde animasyonları kaldıralım
  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-1 text-xs font-medium text-calendar-gray text-center"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-150",
                  !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday(day.date) && "bg-blue-50",
                  holiday && !allowWorkOnHolidays && "bg-red-50",
                  holiday && allowWorkOnHolidays && "bg-yellow-50"
                )}
              >
                <div className={cn(
                  "text-xs font-medium",
                  isToday(day.date) && "text-calendar-blue",
                  holiday && !allowWorkOnHolidays && "text-red-600",
                  holiday && allowWorkOnHolidays && "text-yellow-700"
                )}>
                  {format(day.date, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Aylık görünüm için animasyonlu versiyonu kullanalım
  return (
    <motion.div 
      className="w-full mx-auto"
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.25,
              delay: index * 0.02,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
          >
            {day}
          </motion.div>
        ))}
        
        {days.map((day, idx) => {
          const holiday = isHoliday(day.date);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.25,
                delay: idx * 0.02,
                ease: [0.23, 1, 0.32, 1]
              }}
              onClick={() => handleDateClick(day.date)}
              className={cn(
                "min-h-[120px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-150",
                !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                isToday(day.date) && "bg-blue-50",
                holiday && !allowWorkOnHolidays && "bg-red-50",
                holiday && allowWorkOnHolidays && "bg-yellow-50"
              )}
            >
              <div className={cn(
                "text-sm font-medium",
                isToday(day.date) && "text-calendar-blue",
                holiday && !allowWorkOnHolidays && "text-red-600",
                holiday && allowWorkOnHolidays && "text-yellow-700"
              )}>
                {format(day.date, "d")}
                {holiday && (
                  <div className={cn(
                    "text-xs truncate",
                    !allowWorkOnHolidays ? "text-red-600" : "text-yellow-700"
                  )}>
                    {holiday.name}
                    {allowWorkOnHolidays && " (Çalışmaya Açık)"}
                  </div>
                )}
              </div>
              {!isYearView && (
                <div className="space-y-1">
                  {day.lessons.map((event) => (
                    <div key={event.id} onClick={(e) => {
                      e.stopPropagation();
                      if (onEventClick) onEventClick(event);
                    }}>
                      <MonthEventCard event={event} students={students} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
