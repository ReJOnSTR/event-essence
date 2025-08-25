import { useToast } from "@/components/ui/use-toast";
import { DropResult } from "@hello-pangea/dnd";
import { CalendarEvent } from "@/types/calendar";
import { checkLessonConflict } from "@/utils/lessonConflict";
import { useWorkingHours } from "./useWorkingHours";
import { useCallback } from "react";

interface UseEnhancedDragDropProps {
  events: CalendarEvent[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export const useEnhancedDragDrop = ({ events, onEventUpdate }: UseEnhancedDragDropProps) => {
  const { toast } = useToast();
  const { checkWorkingHours } = useWorkingHours();

  const handleDragEnd = useCallback((
    result: DropResult,
    getNewEventTimes: (result: DropResult) => { start: Date; end: Date } | null
  ) => {
    // Animasyon tamamlanması için kısa bir gecikme
    requestAnimationFrame(() => {
      if (!result.destination || !onEventUpdate) return;

      const event = events.find(e => e.id === result.draggableId);
      if (!event) return;

      const newTimes = getNewEventTimes(result);
      if (!newTimes) return;

      const { start: newStart, end: newEnd } = newTimes;

      // Çalışma saatleri kontrolü
      if (!checkWorkingHours(newStart, newStart.getHours())) {
        toast({
          title: "Çalışma saatleri dışında",
          description: "Bu saat için çalışma saatleri kapalıdır.",
          variant: "destructive"
        });
        return;
      }

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

      // Güncellemeyi gerçekleştir
      onEventUpdate({
        ...event,
        start: newStart,
        end: newEnd
      });

      toast({
        title: "Ders taşındı",
        description: "Ders başarıyla yeni konuma taşındı.",
      });
    });
  }, [events, onEventUpdate, checkWorkingHours, toast]);

  return { handleDragEnd };
};