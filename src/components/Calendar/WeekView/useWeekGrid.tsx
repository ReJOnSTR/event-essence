import { useToast } from "@/hooks/use-toast";
import { isHoliday } from "@/utils/turkishHolidays";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";

export function useWeekGrid() {
  const { toast } = useToast();

  const handleCellClick = (
    day: Date,
    hour: number,
    workingHours: any,
    allowWorkOnHolidays: boolean,
    onCellClick: (day: Date, hour: number) => void
  ) => {
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

  const handleDragEnd = (
    result: any,
    weekDays: Date[],
    events: CalendarEvent[],
    workingHours: any,
    allowWorkOnHolidays: boolean,
    onEventUpdate?: (event: CalendarEvent) => void
  ) => {
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

  return {
    handleCellClick,
    handleDragEnd
  };
}