import { CalendarEvent } from "@/types/calendar";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export default function WeekView({ date, events, onDateSelect }: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const nextWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(addWeeks(date, 1));
  };

  const prevWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(subWeeks(date, 1));
  };

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-semibold">
          {format(weekStart, "MMMM yyyy", { locale: tr })}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
        <div className="bg-white w-16"></div>
        {weekDays.map((day) => (
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
          <>
            <div key={`hour-${hour}`} className="bg-white p-2 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            {weekDays.map((day) => (
              <div
                key={`${day}-${hour}`}
                className={cn(
                  "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50",
                  isToday(day) && "bg-blue-50"
                )}
                onClick={() => {
                  const eventDate = new Date(day);
                  eventDate.setHours(hour);
                  onDateSelect(eventDate);
                }}
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