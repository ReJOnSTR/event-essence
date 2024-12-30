import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useToast } from "@/components/ui/use-toast";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: DayViewProps) {
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleHourClick = (hour: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !onEventUpdate) return;

    const draggedEvent = events.find(e => e.id === active.id);
    if (!draggedEvent) return;

    const hourElement = over.id.toString();
    const newHour = parseInt(hourElement);
    
    if (isNaN(newHour)) return;

    const minutesDiff = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const newStart = new Date(date);
    newStart.setHours(newHour);
    newStart.setMinutes(0);
    
    const newEnd = new Date(newStart.getTime() + minutesDiff);

    const updatedEvent = {
      ...draggedEvent,
      start: newStart,
      end: newEnd,
    };

    onEventUpdate(updatedEvent);
    toast({
      title: "Ders güncellendi",
      description: "Dersin saati başarıyla güncellendi.",
    });
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="w-full">
        <div className="space-y-2">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-12 gap-2">
              <div className="col-span-1 text-right text-sm text-gray-500">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              <div 
                id={hour.toString()}
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
                      students={students}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}