
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { differenceInMinutes, addMinutes } from 'date-fns';
import { checkLessonConflict } from '@/utils/lessonConflict';

export const useMobileDragDrop = (
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [touchStartTime, setTouchStartTime] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleTouchStart = (event: CalendarEvent, e: React.TouchEvent) => {
    setDraggedEvent(event);
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(new Date());
    
    // Wait to determine if this is a drag or just a tap
    setTimeout(() => {
      if (touchStartTime && new Date().getTime() - touchStartTime.getTime() > 150) {
        setIsDragging(true);
      }
    }, 150);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedEvent) return;
    
    // Prevent scrolling when dragging lessons
    if (isDragging) {
      e.preventDefault();
    }
    
    // Visual feedback that dragging is happening
    if (Math.abs(e.touches[0].clientY - touchStartY) > 10) {
      setIsDragging(true);
      document.body.style.cursor = 'grabbing';
      
      // Add visual feedback for mobile dragging
      const element = document.getElementById(`lesson-${draggedEvent.id}`);
      if (element) {
        element.style.opacity = '0.8';
        element.style.transform = 'scale(1.02)';
        element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }
    }
  };

  const handleTouchEnd = (hour: number, minute: number) => {
    if (!draggedEvent || !onEventUpdate || !isDragging) {
      resetDrag();
      return;
    }

    const newStart = new Date(draggedEvent.start);
    newStart.setHours(hour, minute);
    
    const duration = differenceInMinutes(new Date(draggedEvent.end), new Date(draggedEvent.start));
    const newEnd = addMinutes(newStart, duration);

    // Check for conflicts
    const hasConflict = checkLessonConflict(
      { start: newStart, end: newEnd },
      [draggedEvent], // This ensures we don't conflict with the current lesson
      draggedEvent.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
        variant: "destructive"
      });
      
      // Add shake animation to indicate conflict
      const element = document.getElementById(`lesson-${draggedEvent.id}`);
      if (element) {
        element.classList.add('animate-shake');
        setTimeout(() => {
          element.classList.remove('animate-shake');
        }, 500);
      }
      
      resetDrag();
      return;
    }

    onEventUpdate({
      ...draggedEvent,
      start: newStart,
      end: newEnd
    });

    toast({
      title: "Ders taşındı",
      description: "Ders başarıyla yeni saate taşındı.",
    });

    resetDrag();
  };

  const resetDrag = () => {
    // Reset any visual feedback
    const element = document.getElementById(`lesson-${draggedEvent?.id}`);
    if (element) {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
    }
    
    setDraggedEvent(null);
    setTouchStartY(0);
    setTouchStartTime(null);
    setIsDragging(false);
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    if (draggedEvent) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', () => {
        if (isDragging) {
          resetDrag();
        }
      });
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', resetDrag);
      };
    }
  }, [draggedEvent, isDragging]);

  return {
    draggedEvent,
    handleTouchStart,
    handleTouchEnd,
    isDragging
  };
};
