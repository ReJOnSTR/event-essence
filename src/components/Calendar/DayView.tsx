import { CalendarEvent, Student } from "@/types/calendar";
import { format, isToday, parse } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function DayView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: DayViewProps) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  
  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Get the day of the week in lowercase
  const dayOfWeek = format(date, 'EEEE', { locale: tr }).toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  // Parse start and end hours
  const startHour = daySettings?.enabled ? parseInt(daySettings.start.split(':')[0]) : 0;
  const endHour = daySettings?.enabled ? parseInt(daySettings.end.split(':')[0]) : 24;

  // Generate array of hours based on working hours
  const hours = Array.from(
    { length: endHour - startHour }, 
    (_, i) => startHour + i
  );

  const handleHourClick = (hour: number) => {
    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri ayarlanmamış.",
        variant: "destructive"
      });
      return;
    }
    const eventDate = new Date(date);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <div className="w-full">
      <div className="space-y-2">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-12 gap-2">
            <div className="col-span-1 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            <div className="col-span-11 grid grid-rows-4 min-h-[60px]">
              {[0, 15, 30, 45].map((minute) => (
                <div
                  key={`${hour}:${minute}`}
                  className={cn(
                    "border-t border-gray-200 cursor-pointer relative min-h-[15px]",
                    daySettings?.enabled 
                      ? "hover:bg-gray-50" 
                      : "bg-gray-100 cursor-not-allowed"
                  )}
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setHours(hour, minute);
                    if (daySettings?.enabled) {
                      onDateSelect(newDate);
                    } else {
                      toast({
                        title: "Çalışma saatleri dışında",
                        description: "Bu gün için çalışma saatleri ayarlanmamış.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  {minute === 0 && dayEvents
                    .filter(event => new Date(event.start).getHours() === hour)
                    .map(event => (
                      <LessonCard 
                        key={event.id} 
                        event={event} 
                        onClick={onEventClick}
                        students={students}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}