import { CalendarEvent } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60; // 60px per hour

  return (
    <div 
      className="absolute left-0 right-0 mx-1 bg-calendar-event text-white text-sm rounded overflow-hidden"
      style={{ 
        top: `${(new Date(event.start).getMinutes() / 60) * 60}px`,
        height: `${heightInPixels}px`,
        minHeight: '20px'
      }}
    >
      <div className="p-1">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs">
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </div>
      </div>
    </div>
  );
}