import { CalendarEvent } from "@/types/calendar";
import { format, differenceInMinutes } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const durationInMinutes = differenceInMinutes(event.end, event.start);
  const heightInPixels = (durationInMinutes / 60) * 60; // 60px per hour

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div 
      className="bg-calendar-event text-white text-sm p-1 rounded absolute left-0 right-0 mx-1 overflow-hidden cursor-pointer hover:brightness-90 transition-all"
      style={{
        height: `${heightInPixels}px`,
        top: `${(new Date(event.start).getMinutes() / 60) * 60}px`,
      }}
      onClick={handleClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs">
        {format(event.start, "HH:mm", { locale: tr })} - {format(event.end, "HH:mm", { locale: tr })}
      </div>
    </div>
  );
}