import { CalendarEvent } from "@/types/calendar";
import { format, isToday, addMinutes, setHours, setMinutes, differenceInMinutes, parseISO } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onEventUpdate) return;

    const { active, over } = event;
    if (!over) return;

    const draggedEvent = active.data.current as CalendarEvent;
    const [, dropHour] = over.id.toString().split('-').map(Number);
    
    // Calculate minutes based on vertical position
    const cellHeight = 60; // Height of each hour cell in pixels
    const dropOffset = event.delta.y % cellHeight;
    const dropMinutes = Math.floor((dropOffset / cellHeight) * 60);
    
    // Create new start date with the dropped hour and calculated minutes
    const newStart = new Date(date);
    newStart.setHours(dropHour);
    newStart.setMinutes(dropMinutes >= 0 ? dropMinutes : 0);

    // Calculate event duration and set new end time
    const duration = differenceInMinutes(
      new Date(draggedEvent.end),
      new Date(draggedEvent.start)
    );
    const newEnd = addMinutes(newStart, duration);

    // Update the event with new start and end times
    onEventUpdate({
      ...draggedEvent,
      start: newStart,
      end: newEnd,
    });
  };

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

  return (
    <div className="w-full max-w-7xl mx-auto">
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
      <DndContext 
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-12 gap-2">
              <div className="col-span-1 text-right text-sm text-gray-500">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              <div 
                id={`hour-${hour}`}
                className="col-span-11 min-h-[60px] border-t border-gray-200 cursor-pointer hover:bg-gray-50 relative"
                onClick={() => handleHourClick(hour)}
              >
                {dayEvents
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={onEventClick}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}