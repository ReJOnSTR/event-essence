import { CalendarEvent, Student } from "@/types/calendar";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { isHoliday } from "@/utils/turkishHolidays";
import { getWorkingHours } from "@/utils/workingHours";
import LessonCard from "./LessonCard";
import { TimeIndicator } from "./TimeIndicator";
import { checkLessonConflict } from "@/utils/lessonConflict";

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
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const holiday = isHoliday(date);

  const dayOfWeek = date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const daySettings = workingHours[days[dayOfWeek]];

  const [startHour] = (daySettings?.start || "09:00").split(':').map(Number);
  const [endHour] = (daySettings?.end || "17:00").split(':').map(Number);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleCellClick = (hour: number) => {
    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(hour);
    onDateSelect(selectedDate);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [hour] = result.destination.droppableId.split('-').map(Number);
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Resmi Tatil",
        description: `${holiday.name} nedeniyle bu gün resmi tatildir.`,
        variant: "destructive"
      });
      return;
    }

    if (hour < startHour || hour >= endHour) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
        variant: "destructive"
      });
      return;
    }

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    const newStart = new Date(date);
    newStart.setHours(hour, 0, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    // Çakışma kontrolü
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-background p-4 text-center border-b border-border">
            <h2 className="text-lg font-semibold">
              {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
            </h2>
            {holiday && (
              <div className={cn(
                "text-sm mt-1",
                allowWorkOnHolidays ? "text-yellow-500" : "text-destructive"
              )}>
                {holiday.name}
                {allowWorkOnHolidays && " (Çalışmaya Açık)"}
              </div>
            )}
            {!holiday && !daySettings?.enabled && (
              <div className="text-sm mt-1 text-muted-foreground">
                Çalışma Saatleri Kapalı
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 divide-x divide-border">
            <div className="col-span-1">
              {hours.map(hour => (
                <div 
                  key={hour}
                  className="h-[60px] p-2 text-right text-sm text-muted-foreground border-t border-border"
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            <div className="col-span-11">
              {hours.map(hour => (
                <Droppable droppableId={`${hour}`} key={hour}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "col-span-11 min-h-[60px] border-t border-border cursor-pointer relative",
                        snapshot.isDraggingOver && "bg-accent",
                        (!daySettings?.enabled || hour < startHour || hour >= endHour || (holiday && !allowWorkOnHolidays)) && 
                        "bg-muted dark:bg-muted/10 cursor-not-allowed"
                      )}
                      onClick={() => handleCellClick(hour)}
                    >
                      <TimeIndicator 
                        events={events.filter(event => 
                          format(new Date(event.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        )} 
                        hour={hour}
                      />

                      {events
                        .filter(
                          event =>
                            format(new Date(event.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
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
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </DragDropContext>
  );
}