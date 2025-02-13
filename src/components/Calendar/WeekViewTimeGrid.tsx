import React from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { CalendarEvent, Student } from "@/types/calendar";
import LessonCard from "./LessonCard";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Lock, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

    const holiday = isHoliday(targetDay, customHolidays);
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil Günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    const newStart = new Date(targetDay);
    newStart.setHours(hour, 0, 0, 0);
    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      event.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
        variant: "destructive"
      });
      return;
    }

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

  const getCellLockMessage = (day: Date, hour: number) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(day, customHolidays);
    
    if (holiday) {
      return `${holiday.name} nedeniyle kapalı`;
    }
    
    if (!daySettings?.enabled) {
      return "Çalışma saatleri kapalı";
    }
    
    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);
    
    if (hour < startHour || hour >= endHour) {
      return "Çalışma saatleri dışında";
    }
    
    return "Bu saat kapalı";
  };

  const isCellLocked = (day: Date, hour: number) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(day, customHolidays);
    
    if (!daySettings?.enabled || (holiday && !allowWorkOnHolidays)) {
      return true;
    }
    
    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);
    
    return hour < startHour || hour >= endHour;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {hours.map((hour) => (
        <React.Fragment key={`hour-${hour}`}>
          <div className="bg-background p-2 text-right text-sm text-muted-foreground border-b border-border">
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
          {weekDays.map((day, dayIndex) => {
            const isLocked = isCellLocked(day, hour);
            const holiday = isHoliday(day, customHolidays);

            return (
              <Droppable droppableId={`${dayIndex}-${hour}`} key={`${day}-${hour}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "bg-background border-b border-border min-h-[60px] relative",
                      isToday(day) && "bg-accent text-accent-foreground",
                      isLocked && "bg-muted/50",
                      !isLocked && "cursor-pointer hover:bg-accent/50",
                      snapshot.isDraggingOver && !isLocked && "bg-accent/50"
                    )}
                    onClick={() => !isLocked && handleCellClick(day, hour)}
                  >
                    {isLocked && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute top-1 right-1 flex items-center gap-1">
                                {holiday && (
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                )}
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getCellLockMessage(day, hour)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
                      </>
                    )}
                    
                    <div className="relative">
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
                  </div>
                )}
              </Droppable>
            );
          })}
        </React.Fragment>
      ))}
    </DragDropContext>
  );
}
