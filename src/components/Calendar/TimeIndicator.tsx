import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface TimeIndicatorProps {
  events: CalendarEvent[];
  hour: number;
}

export function TimeIndicator({ events, hour }: TimeIndicatorProps) {
  const hourEvents = events.filter(event => {
    const eventStartHour = new Date(event.start).getHours();
    const eventEndHour = new Date(event.end).getHours();
    const eventStartMinutes = new Date(event.start).getMinutes();
    const eventEndMinutes = new Date(event.end).getMinutes();
    
    // Show indicator if:
    // 1. Event starts in this hour with non-zero minutes OR
    // 2. Event ends in this hour with non-zero minutes
    return (eventStartHour === hour && eventStartMinutes > 0) || 
           (eventEndHour === hour && eventEndMinutes > 0);
  });

  if (hourEvents.length === 0) return null;

  return (
    <>
      {hourEvents.map(event => {
        const startHour = new Date(event.start).getHours();
        const endHour = new Date(event.end).getHours();
        const startMinutes = new Date(event.start).getMinutes();
        const endMinutes = new Date(event.end).getMinutes();
        
        // If this is the start hour and has minutes
        if (startHour === hour && startMinutes > 0) {
          return (
            <div 
              key={`start-${event.id}`}
              className="absolute left-0 h-3 flex items-center text-[10px] text-gray-500"
              style={{
                top: `${(startMinutes / 60) * 60}px`
              }}
            >
              <div className="w-0.5 h-full bg-blue-300 mr-1" />
              {format(event.start, "HH:mm", { locale: tr })}
            </div>
          );
        }
        
        // If this is the end hour and has minutes
        if (endHour === hour && endMinutes > 0) {
          return (
            <div 
              key={`end-${event.id}`}
              className="absolute left-0 h-3 flex items-center text-[10px] text-gray-500"
              style={{
                top: `${(endMinutes / 60) * 60}px`
              }}
            >
              <div className="w-0.5 h-full bg-gray-300 mr-1" />
              {format(event.end, "HH:mm", { locale: tr })}
            </div>
          );
        }
        
        return null;
      })}
    </>
  );
}