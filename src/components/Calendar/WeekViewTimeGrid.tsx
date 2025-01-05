import React from "react";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "./LessonCard";
import DroppableCell from "./DroppableCell";

interface WeekViewTimeGridProps {
  weekDays: Date[];
  hours: number[];
  events: CalendarEvent[];
  workingHours: any;
  allowWorkOnHolidays: boolean;
  onCellClick: (day: Date, hour: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function WeekViewTimeGrid({
  weekDays,
  hours,
  events,
  workingHours,
  allowWorkOnHolidays,
  onCellClick,
  onEventClick,
  onEventUpdate,
  students
}: WeekViewTimeGridProps) {
  const { toast } = useToast();

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

    const holiday = isHoliday(day);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    onCellClick(day, hour);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex, hour] = result.destination.droppableId.split('-').map(Number);
    const targetDay = weekDays[dayIndex];
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const dayOfWeek = format(targetDay, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    
    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const holiday = isHoliday(targetDay);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    const newStart = new Date(targetDay);
    newStart.setHours(hour, 0, 0, 0);
    const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni güne taşındı.",
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {hours.map((hour) => (
        <React.Fragment key={`hour-${hour}`}>
          <div className="bg-background p-2 text-right text-sm text-muted-foreground">
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
          {weekDays.map((day, dayIndex) => {
            const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
            const daySettings = workingHours[dayOfWeek];
            const isDayEnabled = daySettings?.enabled;
            const holiday = isHoliday(day);
            const isWorkDisabled = (holiday && !allowWorkOnHolidays) || !isDayEnabled;
            const [startHour] = (daySettings?.start || "09:00").split(':').map(Number);
            const [endHour] = (daySettings?.end || "17:00").split(':').map(Number);
            const isHourDisabled = hour < startHour || hour >= endHour;

            return (
              <DroppableCell
                key={`${day}-${hour}`}
                id={`${dayIndex}-${hour}`}
                isDisabled={isWorkDisabled || isHourDisabled}
                isDayEnabled={isDayEnabled}
                events={events}
                date={day}
                hour={hour}
                onCellClick={() => handleCellClick(day, hour)}
              >
                {events
                  .filter(
                    event =>
                      format(new Date(event.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                      new Date(event.start).getHours() === hour
                  )
                  .map((event, index) => (
                    <LessonCard 
                      key={event.id} 
                      event={{
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end)
                      }}
                      onClick={onEventClick}
                      students={students}
                      index={index}
                    />
                  ))}
              </DroppableCell>
            );
          })}
        </React.Fragment>
      ))}
    </DragDropContext>
  );
}