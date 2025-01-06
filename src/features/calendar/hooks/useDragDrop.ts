import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { DropResult } from "@hello-pangea/dnd";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useCalendarLogic } from "./useCalendarLogic";

export function useDragDrop(
  events: CalendarEvent[],
  onEventUpdate?: (event: CalendarEvent) => void
) {
  const { toast } = useToast();
  const { checkDateAvailability } = useCalendarLogic();

  const handleDragEnd = (
    result: DropResult,
    getNewDates: (result: DropResult) => { start: Date; end: Date } | null
  ) => {
    if (!result.destination || !onEventUpdate) return;

    const newDates = getNewDates(result);
    if (!newDates) return;

    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    const { start: newStart, end: newEnd } = newDates;

    if (!checkDateAvailability(newStart, newStart.getHours())) {
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
      description: "Ders başarıyla yeni saate taşındı.",
    });
  };

  return { handleDragEnd };
}