import { CalendarEvent } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const startHour = event.start.getHours();
  const startMinutes = event.start.getMinutes();
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const topPosition = (startHour * 60 + startMinutes) * (60 / 60); // Convert to pixels (60px per hour)
  const height = (durationInMinutes * (60 / 60)); // Convert to pixels (60px per hour)

  return (
    <div 
      className="absolute left-0 right-2 bg-blue-600 text-white text-sm rounded-md overflow-hidden"
      style={{ 
        top: `${topPosition}px`,
        height: `${height}px`,
        minHeight: '20px'
      }}
    >
      <div className="p-1">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-90">
          {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
        </div>
      </div>
    </div>
  );
}