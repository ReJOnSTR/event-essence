import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import { CalendarEvent, DayCell, Student } from "@/types/calendar";
import { cn } from "@/lib/utils";
import LessonCard from "./LessonCard";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import MonthEventCard from "./MonthEventCard";

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
      const dateWithDefaultHour = new Date(clickedDate);
      dateWithDefaultHour.setHours(9);
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

    // Keep the original hours and minutes
    const originalHours = event.start.getHours();
    const originalMinutes = event.start.getMinutes();
    
    // Create new date with original time
    const newStart = new Date(targetDay);
    newStart.setHours(originalHours, originalMinutes, 0);
    
    // Calculate duration and set end time
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

    // Check if the new time is within working hours
    const [startHour, startMinute] = daySettings.start.split(':').map(Number);
    const [endHour, endMinute] = daySettings.end.split(':').map(Number);
    const workStart = new Date(targetDay);
    workStart.setHours(startHour, startMinute, 0);
    const workEnd = new Date(targetDay);
    workEnd.setHours(endHour, endMinute, 0);

    if (newStart < workStart || newEnd > workEnd) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Seçilen saat çalışma saatleri dışındadır.",
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
      description: "Ders başarıyla yeni güne taşındı.",
    });
  };

  const days = getDaysInMonth(date);

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
                      "min-h-[120px] p-2 bg-white cursor-pointer transition-all duration-200 ease-in-out",
                      !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                      isToday(day.date) && "bg-blue-50",
                      holiday && !allowWorkOnHolidays && "bg-red-50",
                      holiday && allowWorkOnHolidays && "bg-yellow-50",
                      snapshot.isDraggingOver && "bg-blue-50/80 scale-[1.01]"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
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
                    <div className="space-y-1">
                      {day.lessons.map((event, index) => (
                        <MonthEventCard
                          key={event.id}
                          event={event}
                          students={students}
                          index={index}
                          onClick={onEventClick}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
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
