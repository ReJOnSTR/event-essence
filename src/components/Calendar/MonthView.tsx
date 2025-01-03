import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday, setHours, setMinutes } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import LessonCard from "./LessonCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";

interface MonthViewProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  date: Date;
  isYearView?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  students?: Student[];
}

export default function MonthView({ 
  events, 
  onDateSelect, 
  date,
  isYearView = false,
  onEventClick,
  onEventUpdate,
  students
}: MonthViewProps) {
  const { toast } = useToast();
  const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
  const workingHours = getWorkingHours();

  const getDaysInMonth = (currentDate: Date): DayCell[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Adjust for Monday start
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6; // Sunday becomes last day
    
    const prefixDays = Array.from({ length: startDay }, (_, i) => 
      addDays(start, -(startDay - i))
    );
    
    const endDay = end.getDay() - 1;
    const suffixDays = Array.from({ length: endDay === -1 ? 0 : 6 - endDay }, (_, i) =>
      addDays(end, i + 1)
    );
    
    return [...prefixDays, ...days, ...suffixDays].map(dayDate => ({
      date: dayDate,
      isCurrentMonth: isSameMonth(dayDate, currentDate),
      lessons: events.filter(event => isSameDay(event.start, dayDate))
    }));
  };

  const handleDateClick = (clickedDate: Date) => {
    const holiday = isHoliday(clickedDate);
    if (holiday && !allowWorkOnHolidays) {
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const workingHours = getWorkingHours();
    const daySettings = workingHours[days[dayOfWeek]];
    
    if (daySettings.enabled && daySettings.start) {
      const [hours, minutes] = daySettings.start.split(':').map(Number);
      const dateWithWorkingHours = new Date(clickedDate);
      dateWithWorkingHours.setHours(hours, minutes, 0);
      onDateSelect(dateWithWorkingHours);
    } else {
      // If the day is not enabled in working hours, use 9 AM as default
      const dateWithDefaultHour = setHours(clickedDate, 9);
      onDateSelect(dateWithDefaultHour);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const days = getDaysInMonth(date);
    const targetDay = days[dayIndex].date;
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const dayOfWeek = format(targetDay, 'EEEE').toLowerCase() as keyof typeof workingHours;
    const daySettings = workingHours[dayOfWeek];
    const holiday = isHoliday(targetDay);
    
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

    // Ensure event.start and event.end are Date objects
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    const [startHour] = daySettings.start.split(':').map(Number);
    const newStart = setMinutes(setHours(targetDay, startHour), 0);
    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

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

  const days = getDaysInMonth(date);

  // Yıllık görünümde animasyonları ve sürükle-bırak özelliğini kaldıralım
  if (isYearView) {
    return (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-1 text-xs font-medium text-calendar-gray text-center"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "min-h-[40px] p-1 bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-150",
                  !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday(day.date) && "bg-blue-50",
                  holiday && !allowWorkOnHolidays && "bg-red-50",
                  holiday && allowWorkOnHolidays && "bg-yellow-50"
                )}
              >
                <div className={cn(
                  "text-xs font-medium",
                  isToday(day.date) && "text-calendar-blue",
                  holiday && !allowWorkOnHolidays && "text-red-600",
                  holiday && allowWorkOnHolidays && "text-yellow-700"
                )}>
                  {format(day.date, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Aylık görünüm için sürükle-bırak özellikli versiyonu kullanalım
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div 
        className="w-full mx-auto"
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="grid grid-cols-7 gap-px bg-calendar-border rounded-lg overflow-hidden">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.15,
                delay: index * 0.01,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="bg-gray-50 p-2 text-sm font-medium text-calendar-gray text-center"
            >
              {day}
            </motion.div>
          ))}
          
          {days.map((day, idx) => {
            const holiday = isHoliday(day.date);
            return (
              <Droppable droppableId={`${idx}`} key={idx}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.15,
                      delay: idx * 0.01,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    onClick={() => handleDateClick(day.date)}
                    className={cn(
                      "min-h-[120px] p-2 bg-white cursor-pointer transition-colors duration-150",
                      !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                      isToday(day.date) && "bg-blue-50",
                      holiday && !allowWorkOnHolidays && "bg-red-50",
                      holiday && allowWorkOnHolidays && "bg-yellow-50",
                      snapshot.isDraggingOver && "bg-blue-50"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium",
                      isToday(day.date) && "text-calendar-blue",
                      holiday && !allowWorkOnHolidays && "text-red-600",
                      holiday && allowWorkOnHolidays && "text-yellow-700"
                    )}>
                      {format(day.date, "d")}
                      {holiday && (
                        <div className={cn(
                          "text-xs truncate",
                          !allowWorkOnHolidays ? "text-red-600" : "text-yellow-700"
                        )}>
                          {holiday.name}
                          {allowWorkOnHolidays && " (Çalışmaya Açık)"}
                        </div>
                      )}
                    </div>
                    {!isYearView && (
                      <div className="space-y-1">
                        {day.lessons.map((event, index) => (
                          <div key={event.id} onClick={(e) => {
                            e.stopPropagation();
                            if (onEventClick) onEventClick(event);
                          }}>
                            <LessonCard 
                              event={{
                                ...event,
                                start: new Date(event.start),
                                end: new Date(event.end)
                              }}
                              onClick={onEventClick}
                              students={students}
                              index={index}
                            />
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </motion.div>
                )}
              </Droppable>
            );
          })}
        </div>
      </motion.div>
    </DragDropContext>
  );
}
