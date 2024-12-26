import { CalendarEvent } from "@/types/calendar";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function DayView({ date, events, onDateSelect }: DayViewProps) {
  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const nextDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    onDateSelect(next);
  };

  const prevDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = new Date(date);
    prev.setDate(date.getDate() - 1);
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

  const calculateEventStyle = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const endHour = event.end.getHours();
    const duration = endHour - startHour;
    
    return {
      position: 'absolute' as const,
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
      left: '0',
      right: '0',
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4" onClick={(e) => e.stopPropagation()}>
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
            onClick={prevDay}
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
            onClick={nextDay}
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
              {hour === 0 && dayEvents.map(event => (
                <div key={event.id} style={calculateEventStyle(event)}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}