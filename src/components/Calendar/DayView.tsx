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
  
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof typeof workingHours;
  const daySettings = workingHours[dayOfWeek];

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Parse working hours
  const startHour = daySettings?.enabled ? 
    parseInt(daySettings.start.split(':')[0]) : 
    9;
  const endHour = daySettings?.enabled ? 
    parseInt(daySettings.end.split(':')[0]) : 
    17;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleHourClick = (hour: number) => {
    const eventDate = new Date(date);
    eventDate.setHours(hour);
    
    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const currentTime = `${hour}:00`;
    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

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
                    "cursor-pointer hover:bg-gray-50 relative min-h-[15px]",
                    (!daySettings?.enabled || hour < startHour || hour >= endHour) && 
                    "bg-gray-100 cursor-not-allowed"
                  )}
                  onClick={() => {
                    const newDate = new Date(date);
                    newDate.setHours(hour, minute);
                    handleHourClick(hour);
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