import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: CalendarEvent;
}

export default function MonthEventCard({ event }: EventCardProps) {
  return (
    <div className="bg-calendar-event text-white text-sm p-1 rounded truncate mb-1">
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">{event.title}</span>
        <span className="text-xs whitespace-nowrap">
          {format(event.start, "HH:mm", { locale: tr })}
        </span>
      </div>
    </div>
  );
}