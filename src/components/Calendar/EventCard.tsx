import { CalendarEvent } from "@/types/calendar";
import { format, differenceInHours } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const duration = differenceInHours(event.end, event.start);
  
  return (
    <div 
      className="bg-calendar-event text-white text-sm p-1 rounded absolute w-full"
      style={{ 
        height: `${duration * 60}px`,
        top: '0',
        left: '0',
        right: '0'
      }}
    >
      <div className="font-medium">{event.title}</div>
      <div className="text-xs">
        {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
      </div>
    </div>
  );
}