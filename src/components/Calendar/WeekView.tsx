import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekView({ 
  date, 
  events, 
  onDateSelect, 
  onEventClick,
  onEventUpdate,
  students 
}: WeekViewProps) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get earliest start and latest end hours across the week
  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0])));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleCellClick = (day: Date, hour: number) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const dayStartHour = parseInt(daySettings.start.split(':')[0]);
    const dayEndHour = parseInt(daySettings.end.split(':')[0]);

    if (hour < dayStartHour || hour >= dayEndHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const eventDate = new Date(day);
    eventDate.setHours(hour);
    onDateSelect(eventDate);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-8 gap-px bg-gray-200">
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
          <React.Fragment key={`hour-${hour}`}>
            <div className="bg-white p-2 text-right text-sm text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            {weekDays.map((day) => {
              const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
              const daySettings = workingHours[dayOfWeek];
              const isDayEnabled = daySettings?.enabled;
              const isHourInRange = isDayEnabled && 
                hour >= parseInt(daySettings.start.split(':')[0]) && 
                hour < parseInt(daySettings.end.split(':')[0]);

              return (
                <div
                  key={`${day}-${hour}`}
                  className={cn(
                    "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 relative",
                    isToday(day) && "bg-blue-50",
                    (!isDayEnabled || !isHourInRange) && "bg-gray-100 cursor-not-allowed"
                  )}
                  onClick={() => handleCellClick(day, hour)}
                >
                  {events
                    .filter(
                      event =>
                        format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                        new Date(event.start).getHours() === hour
                    )
                    .map(event => (
                      <LessonCard 
                        key={event.id} 
                        event={event} 
                        onClick={onEventClick}
                        students={students}
                      />
                    ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}