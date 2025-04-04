
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { differenceInMinutes, addMinutes } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { checkLessonConflict } from '@/utils/lessonConflict';
import { resizeEvent } from '@/utils/dateUtils';

interface ResizeHandleOptions {
  events: CalendarEvent[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export const useResizableLesson = ({ events, onEventUpdate }: ResizeHandleOptions) => {
  const [resizingEvent, setResizingEvent] = useState<CalendarEvent | null>(null);
  const [resizeType, setResizeType] = useState<'start' | 'end' | null>(null);
  const [initialY, setInitialY] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  const [previewEvent, setPreviewEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();

  const handleResizeStart = (event: CalendarEvent, type: 'start' | 'end', y: number) => {
    setResizingEvent(event);
    setResizeType(type);
    setInitialY(y);
    setInitialTime(type === 'start' ? new Date(event.start) : new Date(event.end));
    setPreviewEvent(event);
    document.body.style.cursor = 'ns-resize';
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!resizingEvent || !resizeType || !initialTime) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - initialY;
    
    // Convert pixels to minutes (15 minutes per 20px)
    const pixelsPerMinute = 1/3; // approximately 20px per hour / 60 minutes
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    
    // Create new dates based on resize type
    const { start: newStart, end: newEnd } = resizeEvent(
      resizingEvent,
      resizeType,
      deltaMinutes,
      15 // minimum duration of 15 minutes
    );
    
    // Update preview
    setPreviewEvent({
      ...resizingEvent,
      start: newStart,
      end: newEnd
    });
  };

  const handleResizeEnd = (e: MouseEvent | TouchEvent) => {
    if (!resizingEvent || !resizeType || !initialTime || !onEventUpdate || !previewEvent) {
      resetResize();
      return;
    }

    // Check for conflicts with the final position
    const hasConflict = checkLessonConflict(
      { start: previewEvent.start, end: previewEvent.end },
      events,
      resizingEvent.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
        variant: "destructive"
      });
      resetResize();
      return;
    }
    
    // Update the event
    onEventUpdate({
      ...previewEvent
    });
    
    toast({
      title: "Ders süresi güncellendi",
      description: `Ders süresi ${differenceInMinutes(previewEvent.end, previewEvent.start)} dakika olarak ayarlandı.`,
    });
    
    resetResize();
  };

  const resetResize = () => {
    setResizingEvent(null);
    setResizeType(null);
    setInitialY(0);
    setInitialTime(null);
    setPreviewEvent(null);
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    if (resizingEvent) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('touchend', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
      };
    }
  }, [resizingEvent, resizeType, initialY, initialTime, previewEvent]);

  return {
    handleResizeStart,
    isResizing: !!resizingEvent,
    previewEvent,
  };
};
