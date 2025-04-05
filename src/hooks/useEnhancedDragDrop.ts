
import { useState, useRef } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { checkLessonConflict } from '@/utils/lessonConflict';
import { DropResult } from '@hello-pangea/dnd';
import { isHoliday } from '@/utils/turkishHolidays';

export const useEnhancedDragDrop = (
  events: CalendarEvent[],
  onEventUpdate?: (event: CalendarEvent) => void,
  workingHours?: any,
  allowWorkOnHolidays?: boolean,
  customHolidays?: Array<{ date: string; description?: string }>
) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startDrag = (event: CalendarEvent) => {
    setActiveEvent(event);
    // Small delay to prevent accidental drags
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(true);
    }, 150);
  };

  const endDrag = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setIsDragging(false);
    setActiveEvent(null);
  };

  const handleDragStart = (event: CalendarEvent) => {
    startDrag(event);
    // Return data needed for custom drag preview
    return {
      event,
      isDragging: true
    };
  };

  const checkWorkingHours = (date: Date, workingHours: any) => {
    if (!workingHours) return true;
    
    const dayOfWeek = date.getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const daySettings = workingHours[days[dayOfWeek]];
    
    if (!daySettings?.enabled) return false;
    
    const hour = date.getHours();
    const [startHour] = daySettings.start.split(':').map(Number);
    const [endHour] = daySettings.end.split(':').map(Number);
    
    return hour >= startHour && hour < endHour;
  };

  const handleDragEnd = (
    result: DropResult,
    getNewEventTimes: (result: DropResult) => { start: Date; end: Date } | null
  ) => {
    endDrag();
    
    if (!result.destination || !onEventUpdate) return;

    const event = events.find(e => e.id === result.draggableId);
    if (!event) return;

    const newTimes = getNewEventTimes(result);
    if (!newTimes) return;

    const { start: newStart, end: newEnd } = newTimes;

    // Check working hours
    if (workingHours && !checkWorkingHours(newStart, workingHours)) {
      toast({
        title: "Çalışma saatleri dışında",
        description: "Bu saat için çalışma saatleri kapalıdır.",
        variant: "destructive"
      });
      return;
    }

    // Check holidays
    if (!allowWorkOnHolidays) {
      const holiday = isHoliday(newStart, customHolidays);
      if (holiday) {
        toast({
          title: "Tatil Günü",
          description: `${holiday.name} nedeniyle bu gün tatildir.`,
          variant: "destructive"
        });
        return;
      }
    }

    // Check conflicts
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
  };

  return {
    isDragging,
    activeEvent,
    handleDragStart,
    handleDragEnd,
    endDrag
  };
};
