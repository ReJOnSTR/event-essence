import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/components/ui/use-toast";
import { DropResult } from "@hello-pangea/dnd";
import { getWorkingHours } from "@/utils/workingHours";
import { isHoliday } from "@/utils/turkishHolidays";
import { checkLessonConflict } from "@/utils/lessonConflict";

export function useMonthDragDrop(
  events: CalendarEvent[],
  onEventUpdate?: (event: CalendarEvent) => void
) {
  const { toast } = useToast();
  const workingHours = getWorkingHours();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onEventUpdate) return;

    const [dayIndex] = result.destination.droppableId.split('-').map(Number);
    const event = events.find(e => e.id === result.draggableId);
    
    if (!event) return;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const duration = eventEnd.getTime() - eventStart.getTime();
    
    const newStart = new Date(eventStart);
    newStart.setDate(newStart.getDate() + (dayIndex - result.source.index));
    const newEnd = new Date(newStart.getTime() + duration);

    const dayOfWeek = newStart.getDay();
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[weekDays[dayOfWeek]];

    if (!daySettings?.enabled) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu gün için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    const holiday = isHoliday(newStart);
    const allowWorkOnHolidays = localStorage.getItem('allowWorkOnHolidays') === 'true';
    if (holiday && !allowWorkOnHolidays) {
      toast({
        title: "Tatil günü",
        description: `${holiday.name} nedeniyle bu gün tatildir.`,
        variant: "destructive"
      });
      return;
    }

    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      events,
      event.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen günde ve saatte başka bir ders bulunuyor.",
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

  return { handleDragEnd };
}