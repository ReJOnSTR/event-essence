
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { differenceInMinutes, addMinutes } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { checkLessonConflict } from '@/utils/lessonConflict';
import { useAnimation } from 'framer-motion';

interface ResizeHandleOptions {
  events: CalendarEvent[];
  onEventUpdate?: (event: CalendarEvent) => void;
}

export const useResizableLesson = ({ events, onEventUpdate }: ResizeHandleOptions) => {
  const [resizingEvent, setResizingEvent] = useState<CalendarEvent | null>(null);
  const [resizeType, setResizeType] = useState<'start' | 'end' | null>(null);
  const [initialY, setInitialY] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  const [previewDelta, setPreviewDelta] = useState<number>(0);
  const resizeControls = useAnimation();
  const { toast } = useToast();

  const handleResizeStart = (event: CalendarEvent, type: 'start' | 'end', y: number) => {
    setResizingEvent(event);
    setResizeType(type);
    setInitialY(y);
    setInitialTime(type === 'start' ? new Date(event.start) : new Date(event.end));
    
    // Animasyon için vurgu
    resizeControls.start({
      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.7)",
      transition: { duration: 0.2 }
    });
  };

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!resizingEvent || !resizeType || !initialTime) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - initialY;
    
    // Convert pixels to minutes (assuming 1px = 1min or adjust as needed)
    // We're using pixelsPerMinute of 1 for simplicity, can be adjusted
    const pixelsPerMinute = 1;
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    setPreviewDelta(deltaMinutes);
    
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
    
    // Preview the resize with visual feedback
    document.body.style.cursor = 'ns-resize';
    
    // Animasyon ile boyut değişimi önizlemesi
    if (resizeType === 'start') {
      const heightChange = differenceInMinutes(resizingEvent.end, newStart) / 60 * 60;
      const topChange = (newStart.getMinutes() / 60) * 60;
      
      resizeControls.start({
        height: `${heightChange}px`,
        top: `${topChange}px`,
        transition: { type: "spring", damping: 20, stiffness: 300 }
      });
    } else {
      const heightChange = differenceInMinutes(newEnd, resizingEvent.start) / 60 * 60;
      
      resizeControls.start({
        height: `${heightChange}px`,
        transition: { type: "spring", damping: 20, stiffness: 300 }
      });
    }
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
      // Çakışma animasyonu
      resizeControls.start({
        x: [0, -5, 5, -5, 5, 0],
        boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.7)",
        transition: { duration: 0.4 }
      }).then(() => {
        resizeControls.start({ 
          x: 0,
          boxShadow: "none",
          transition: { duration: 0.2 }
        });
        
        toast({
          title: "Ders çakışması",
          description: "Seçilen saatte başka bir ders bulunuyor.",
          variant: "destructive"
        });
        resetResize();
      });
      return;
    }
    
    // Başarılı boyutlandırma animasyonu
    resizeControls.start({
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 0 2px rgba(37, 99, 235, 0.7)",
        "0 0 0 3px rgba(37, 99, 235, 0.9)",
        "none"
      ],
      transition: { duration: 0.5 }
    }).then(() => {
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
    });
  };

  const resetResize = () => {
    setResizingEvent(null);
    setResizeType(null);
    setInitialY(0);
    setInitialTime(null);
    setPreviewDelta(0);
    document.body.style.cursor = 'auto';
    
    // Animasyonu sıfırla
    resizeControls.start({
      boxShadow: "none",
      transition: { duration: 0.2 }
    });
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
    resizeType,
    previewDelta,
    resizeControls
  };
};
