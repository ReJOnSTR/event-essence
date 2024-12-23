import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";

interface EventCardProps {
  event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-calendar-event text-white text-sm p-1 rounded truncate">
      <div className="font-medium">{event.title}</div>
      <div className="text-xs">
        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
      </div>
    </div>
  );
}