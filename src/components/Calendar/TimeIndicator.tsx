import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

interface TimeIndicatorProps {
  events: CalendarEvent[];
  hour: number;
}

export const TimeIndicator = ({ events, hour }: TimeIndicatorProps) => {
  return (
    <>
      {events.map(event => {
        const startHour = new Date(event.start).getHours();
        const endHour = new Date(event.end).getHours();
        const startMinutes = new Date(event.start).getMinutes();
        const endMinutes = new Date(event.end).getMinutes();
        
        return (
          <>
            {/* Start time indicator */}
            {startHour === hour && startMinutes > 0 && (
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
            )}
            
            {/* End time indicator */}
            {endHour === hour && endMinutes > 0 && (
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
            )}
          </>
        );
      })}
    </>
  );
};