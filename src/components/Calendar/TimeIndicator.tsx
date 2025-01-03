import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { getShowTimeIndicators } from "@/utils/settings";

interface TimeIndicatorProps {
  events: CalendarEvent[];
  hour: number;
}

export function TimeIndicator({ events, hour }: TimeIndicatorProps) {
  const showTimeIndicators = getShowTimeIndicators();

  if (!showTimeIndicators) return null;

  const hourEvents = events.filter(event => {
    const eventHour = new Date(event.start).getHours();
    const eventEndMinutes = new Date(event.end).getMinutes();
    
    // Only show indicator if the event starts in this hour AND ends at a non-exact hour
    return eventHour === hour && eventEndMinutes > 0;
  });

  if (hourEvents.length === 0) return null;

  return (
    <>
      {hourEvents.map(event => {
        const endMinutes = new Date(event.end).getMinutes();
        
        return (
          <div 
            key={event.id} 
            className="absolute left-0 h-3 flex items-center text-[10px] text-gray-500"
            style={{
              top: `${(endMinutes / 60) * 60}px`
            }}
          >
            <div className="w-0.5 h-full bg-gray-300 mr-1" />
            {format(event.end, "HH:mm", { locale: tr })}
          </div>
        );
      })}
    </>
  );
}