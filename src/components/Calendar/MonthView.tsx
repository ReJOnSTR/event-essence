import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell } from "@/types/calendar";
import { cn } from "@/lib/utils";
import MonthEventCard from "./MonthEventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  currentDate?: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  currentDate: propCurrentDate, 
  isYearView = false,
  onEventClick 
}: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(propCurrentDate || new Date());
  
  const getDaysInMonth = (date: Date): DayCell[] => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    const startDay = start.getDay();
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay();
    const suffixDays = Array.from({ length: 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      events: events.filter(event => isSameDay(event.start, date))
    }));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(addDays(startOfMonth(currentDate), -1));
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={cn("w-full mx-auto", isYearView && "h-full")}>
      {!isYearView && (
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy", { locale: tr })}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={goToToday}
              className="flex gap-2 items-center"
            >
              <CalendarDays className="h-4 w-4" />
              Bugün
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
        {["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, idx) => (
          <div
            key={idx}
            onClick={() => onDateSelect(day.date)}
            className={cn(
              "min-h-[120px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
              !day.isCurrentMonth && "bg-gray-50 text-gray-400",
              isToday(day.date) && "bg-blue-50",
              isYearView && "min-h-[40px]"
            )}
          >
            <div className={cn(
              "text-sm font-medium",
              isToday(day.date) && "text-calendar-blue"
            )}>
              {format(day.date, "d")}
            </div>
            {!isYearView && (
              <div className="space-y-1">
                {day.events.map((event) => (
                  <div key={event.id} onClick={(e) => handleEventClick(e, event)}>
                    <MonthEventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}