import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isToday, setHours, setMinutes, addMinutes, differenceInMinutes, parseISO } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
}

export default function WeekView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate 
}: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
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
    const [, dropHour, dayIndex] = over.id.toString().split('-').map(Number);
    const dropMinutes = Math.round((event.delta.y % 60) / 60 * 60);

    // Calculate the new date based on the week start and day index
    const newDate = addDays(weekStart, dayIndex);
    const newStart = new Date(newDate);
    newStart.setHours(dropHour);
    newStart.setMinutes(dropMinutes >= 0 ? dropMinutes : 0);

    // Calculate event duration and set new end time
    const duration = differenceInMinutes(
      new Date(draggedEvent.end),
      new Date(draggedEvent.start)
    );
    const newEnd = addMinutes(newStart, duration);

    onEventUpdate({
      ...draggedEvent,
      start: newStart,
      end: newEnd,
    });
  };

  const nextWeek = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = addWeeks(date, 1);
    onDateSelect(next);
  };

  const prevWeek = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = subWeeks(date, 1);
    onDateSelect(prev);
  };

  const goToToday = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateSelect(new Date());
  };

  const handleCellClick = (day: Date, hour: number) => {
    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-semibold">
          {format(weekStart, "MMMM yyyy", { locale: tr })}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevWeek}
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
            onClick={nextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
          <div className="bg-white w-16"></div>
          {weekDays.map((day, dayIndex) => (
            <div
              key={day.toString()}
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
            </div>
          ))}

          {hours.map((hour) => (
            <React.Fragment key={`hour-${hour}`}>
              <div className="bg-white p-2 text-right text-sm text-gray-500">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {weekDays.map((day, dayIndex) => (
                <div
                  key={`${day}-${hour}`}
                  id={`cell-${hour}-${dayIndex}`}
                  className={cn(
                    "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 relative",
                    isToday(day) && "bg-blue-50"
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
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onClick={onEventClick}
                      />
                    ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
