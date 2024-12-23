import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
}

export default function DayView({ date, events }: DayViewProps) {
  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-2xl font-semibold mb-4">
        {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
      </div>
      <div className="space-y-2">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-12 gap-2">
            <div className="col-span-1 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            <div className="col-span-11 min-h-[60px] border-t border-gray-200">
              {dayEvents
                .filter(event => new Date(event.start).getHours() === hour)
                .map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}