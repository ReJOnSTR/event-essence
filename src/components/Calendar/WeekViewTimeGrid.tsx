import React from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "./LessonCard";
import { useDragDropManager } from "@/hooks/useDragDropManager";
import { useUserSettings } from "@/hooks/useUserSettings";
import { motion, AnimatePresence } from "framer-motion";

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
  const { settings } = useUserSettings();
  const customHolidays = settings?.holidays || [];

  // Use centralized drag-drop manager
  const { handleDragEnd } = useDragDropManager({
    view: 'week',
    date: weekDays[0], // Use first day of week as reference
    events,
    onEventUpdate
  });

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

    const holiday = isHoliday(day, customHolidays);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil Günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);

    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    onCellClick(day, hour);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {hours.map((hour, hourIndex) => (
        <React.Fragment key={`hour-${hour}`}>
          <motion.div 
            className="bg-background p-2 text-right text-sm text-muted-foreground border-b border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: hourIndex * 0.01 }}
          >
            {`${hour.toString().padStart(2, '0')}:00`}
          </motion.div>
          {weekDays.map((day, dayIndex) => {
            const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
            const daySettings = workingHours[dayOfWeek];
            const isDayEnabled = daySettings?.enabled;
            const holiday = isHoliday(day, customHolidays);
            const isWorkDisabled = (holiday && !allowWorkOnHolidays) || !isDayEnabled;
            const [startHour] = (daySettings?.start || "09:00").split(':').map(Number);
            const [endHour] = (daySettings?.end || "17:00").split(':').map(Number);
            const isHourDisabled = hour < startHour || hour >= endHour;

            return (
              <Droppable droppableId={`${dayIndex}-${hour}`} key={`${day}-${hour}`}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "bg-background border-b border-border min-h-[60px] relative transition-all duration-200",
                      isToday(day) && "bg-accent text-accent-foreground",
                      (isWorkDisabled || isHourDisabled) && "bg-muted cursor-not-allowed",
                      !isWorkDisabled && !isHourDisabled && "cursor-pointer hover:bg-accent/50",
                      snapshot.isDraggingOver && "bg-primary/10 ring-2 ring-primary/20"
                    )}
                    onClick={() => handleCellClick(day, hour)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (hourIndex * 7 + dayIndex) * 0.005 }}
                  >
                    <AnimatePresence>
                      {snapshot.isDraggingOver && (
                        <motion.div 
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="h-full w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                  </motion.div>
                )}
              </Droppable>
            );
          })}
        </React.Fragment>
      ))}
    </DragDropContext>
  );
}