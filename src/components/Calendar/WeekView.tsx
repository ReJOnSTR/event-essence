import { CalendarEvent } from "@/types/calendar";
import { format, addDays, startOfWeek } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
}

export default function WeekView({ date, events }: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto">
      <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
        <div className="bg-white w-16"></div>
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="bg-white p-2 text-center"
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
          <>
            <div key={`hour-${hour}`} className="bg-white p-2 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            {weekDays.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="bg-white border-t border-gray-200 min-h-[60px]"
              >
                {events
                  .filter(
                    event =>
                      format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                      new Date(event.start).getHours() === hour
                  )
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}