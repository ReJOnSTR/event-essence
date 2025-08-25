
import { useToast } from "@/components/ui/use-toast";
import { DropResult } from "@hello-pangea/dnd";
import { CalendarEvent } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useWorkingHours } from "./useWorkingHours";

export const useCalendarDragDrop = (
  events: CalendarEvent[],
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const { toast } = useToast();
  const { checkWorkingHours } = useWorkingHours();

  const handleDragEnd = (
    result: DropResult,
    getNewEventTimes: (result: DropResult) => { start: Date; end: Date } | null
  ) => {
    if (!result.destination || !onEventUpdate) return;

    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    // Short delay to allow animation to complete visually before updating state
    setTimeout(() => {
      const newTimes = getNewEventTimes(result);
      if (!newTimes) return;

      const { start: newStart, end: newEnd } = newTimes;

      if (!checkWorkingHours(newStart, newStart.getHours())) {
        toast({
          title: "Çalışma saatleri dışında",
          description: "Bu saat için çalışma saatleri kapalıdır.",
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
        description: "Ders başarıyla yeni konuma taşındı.",
      });
    }, 100); // Optimized delay for smoother visual feedback
  };

  return { handleDragEnd };
};
