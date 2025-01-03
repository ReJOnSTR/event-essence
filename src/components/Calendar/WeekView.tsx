import React from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { format, addDays, startOfWeek, isToday, setHours, setMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import LessonCard from "./LessonCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

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
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';

  const startHour = Math.min(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.start.split(':')[0])));
  const endHour = Math.max(...Object.values(workingHours)
    .filter(day => day.enabled)
    .map(day => parseInt(day.end.split(':')[0})));

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const handleCellClick = (day: Date, hour: number) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(day);

    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

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

    // Ensure event.start and event.end are Date objects
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    const newStart = setMinutes(setHours(targetDay, hour), 0);
    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    onEventUpdate({
      ...event,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni saate taşındı.",
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full overflow-x-auto"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-white w-16" />
          {weekDays.map((day, index) => {
            const holiday = isHoliday(day);
            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.25,
                  delay: index * 0.02,
                  ease: [0.23, 1, 0.32, 1]
                }}
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
                {holiday && (
                  <div className="text-xs text-gray-500">
                    {holiday.name}
                  </div>
                )}
              </motion.div>
            );
          })}

          {hours.map((hour) => (
            <React.Fragment key={`hour-${hour}`}>
              <div className="bg-white p-2 text-right text-sm text-gray-500">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
                const daySettings = workingHours[dayOfWeek];
                const isDayEnabled = daySettings?.enabled;
                const holiday = isHoliday(day);
                const isWorkDisabled = (holiday && !allowWorkOnHolidays) || !isDayEnabled;

                return (
                  <Droppable droppableId={`${dayIndex}-${hour}`} key={`${day}-${hour}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "bg-white border-t border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50 relative transition-all duration-200 ease-in-out",
                          isToday(day) && "bg-blue-50",
                          isWorkDisabled && "bg-gray-100 cursor-not-allowed",
                          snapshot.isDraggingOver && "bg-blue-50/80 scale-[1.01]"
                        )}
                        onClick={() => handleCellClick(day, hour)}
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
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </DragDropContext>
  );
}
