
import React from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { Droppable, DropResult } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "./LessonCard";
import { useUserSettings } from "@/hooks/useUserSettings";
import DragDropContainer from "./DragDropContainer";
import { useEnhancedDragDrop } from "@/hooks/useEnhancedDragDrop";
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

  const {
    isDragging,
    activeEvent,
    handleDragEnd
  } = useEnhancedDragDrop(
    events,
    onEventUpdate,
    workingHours,
    allowWorkOnHolidays,
    customHolidays
  );

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

  const onDragEndHandler = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex, hour] = result.destination.droppableId.split('-').map(Number);
    const targetDay = weekDays[dayIndex];
    
    handleDragEnd(result, (result) => {
      const [dayIndex, hour] = result.destination!.droppableId.split('-').map(Number);
      const targetDay = weekDays[dayIndex];
      const event = events.find(e => e.id === result.draggableId);
      
      if (!event) return null;

      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      const newStart = new Date(targetDay);
      newStart.setHours(hour, 0, 0, 0);
      const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
      const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

      return { start: newStart, end: newEnd };
    });
  };

  return (
    <DragDropContainer 
      onDragEnd={onDragEndHandler}
      activeEvent={activeEvent}
      isDragging={isDragging}
    >
      {hours.map((hour) => (
        <React.Fragment key={`hour-${hour}`}>
          <div className="bg-background p-2 text-right text-sm text-muted-foreground border-b border-border">
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
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
                    animate={{
                      backgroundColor: snapshot.isDraggingOver 
                        ? 'hsl(var(--accent))' 
                        : isWorkDisabled || isHourDisabled 
                          ? 'hsl(var(--muted))' 
                          : isToday(day) 
                            ? 'hsl(var(--accent))' 
                            : 'hsl(var(--background))'
                    }}
                    transition={{ type: "tween", duration: 0.15 }}
                    className={cn(
                      "border-b border-border min-h-[60px] relative transition-colors duration-150",
                      isToday(day) && "text-accent-foreground",
                      (isWorkDisabled || isHourDisabled) && "cursor-not-allowed",
                      !isWorkDisabled && !isHourDisabled && "cursor-pointer hover:bg-accent/50",
                    )}
                    onClick={() => handleCellClick(day, hour)}
                  >
                    <AnimatePresence>
                      {snapshot.isDraggingOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/30 rounded-sm pointer-events-none"
                        />
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
                          customDragHandle={true}
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
    </DragDropContainer>
  );
}
