import { CalendarEvent } from "@/types/calendar";
import { format, isToday, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export default function DayView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate 
}: DayViewProps) {
  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = addMonths(date, 1);
    onDateSelect(next);
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = addMonths(date, -1);
    onDateSelect(prev);
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(new Date());
  };

  const handleHourClick = (hour: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "text-2xl font-semibold",
          isToday(date) && "text-calendar-blue"
        )}>
          {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
        </div>
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

      <div className="space-y-2">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-12 gap-2">
            <div className="col-span-1 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            <div 
              className="col-span-11 min-h-[60px] border-t border-gray-200 cursor-pointer hover:bg-gray-50 relative"
              onClick={() => handleHourClick(hour)}
            >
              {dayEvents
                .filter(event => new Date(event.start).getHours() === hour)
                .map(event => (
                  <LessonCard 
                    key={event.id} 
                    event={event} 
                    onClick={onEventClick}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}