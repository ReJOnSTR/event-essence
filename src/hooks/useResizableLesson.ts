
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { differenceInMinutes, addMinutes } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { checkLessonConflict } from '@/utils/lessonConflict';

interface ResizeHandleOptions {
  events: CalendarEvent[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export const useResizableLesson = ({ events, onEventUpdate }: ResizeHandleOptions) => {
  const [resizingEvent, setResizingEvent] = useState<CalendarEvent | null>(null);
  const [resizeType, setResizeType] = useState<'start' | 'end' | null>(null);
  const [initialY, setInitialY] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleResizeStart = (event: CalendarEvent, type: 'start' | 'end', y: number) => {
    setResizingEvent(event);
    setResizeType(type);
    setInitialY(y);
    setInitialTime(type === 'start' ? new Date(event.start) : new Date(event.end));
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!resizingEvent || !resizeType || !initialTime) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - initialY;
    
    // Convert pixels to minutes (assuming 1px = 1min or adjust as needed)
    // We're using pixelsPerMinute of 1 for simplicity, can be adjusted
    const pixelsPerMinute = 1;
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    
    // Create new dates
    let newStart = new Date(resizingEvent.start);
    let newEnd = new Date(resizingEvent.end);
    
    if (resizeType === 'start') {
      newStart = addMinutes(initialTime, deltaMinutes);
      
      // Ensure lesson duration is at least 15 minutes
      if (differenceInMinutes(newEnd, newStart) < 15) {
        newStart = addMinutes(newEnd, -15);
      }
    } else {
      newEnd = addMinutes(initialTime, deltaMinutes);
      
      // Ensure lesson duration is at least 15 minutes
      if (differenceInMinutes(newEnd, newStart) < 15) {
        newEnd = addMinutes(newStart, 15);
      }
    }
    
    // Preview the resize
    const previewEvent = {
      ...resizingEvent,
      start: newStart,
      end: newEnd
    };
    
    // We could add visual feedback here
    document.body.style.cursor = 'ns-resize';
  };

  const handleResizeEnd = (e: MouseEvent | TouchEvent) => {
    if (!resizingEvent || !resizeType || !initialTime || !onEventUpdate) {
      resetResize();
      return;
    }

    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = clientY - initialY;
    
    // Convert pixels to minutes (assuming 1px = 1min or adjust as needed)
    const pixelsPerMinute = 1;
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    
    // Create new dates
    let newStart = new Date(resizingEvent.start);
    let newEnd = new Date(resizingEvent.end);
    
    if (resizeType === 'start') {
      newStart = addMinutes(initialTime, deltaMinutes);
      // Ensure lesson duration is at least 15 minutes
      if (differenceInMinutes(newEnd, newStart) < 15) {
        newStart = addMinutes(newEnd, -15);
      }
    } else {
      newEnd = addMinutes(initialTime, deltaMinutes);
      // Ensure lesson duration is at least 15 minutes
      if (differenceInMinutes(newEnd, newStart) < 15) {
        newEnd = addMinutes(newStart, 15);
      }
    }
    
    // Check for conflicts
    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
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
      ...resizingEvent,
      start: newStart,
      end: newEnd
    });
    
    toast({
      title: "Ders süresi güncellendi",
      description: `Ders süresi ${differenceInMinutes(newEnd, newStart)} dakika olarak ayarlandı.`,
    });
    
    resetResize();
  };

  const resetResize = () => {
    setResizingEvent(null);
    setResizeType(null);
    setInitialY(0);
    setInitialTime(null);
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
  }, [resizingEvent, resizeType, initialY, initialTime]);

  return {
    handleResizeStart,
    isResizing: !!resizingEvent,
  };
};
