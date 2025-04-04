
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { differenceInMinutes, addMinutes, setHours, setMinutes } from 'date-fns';
import { checkLessonConflict } from '@/utils/lessonConflict';

export const useMobileDragDrop = (
  events: CalendarEvent[],
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [touchStartTime, setTouchStartTime] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<{hour: number, minute: number} | null>(null);
  const [previewElement, setPreviewElement] = useState<HTMLElement | null>(null);
  const { toast } = useToast();

  const handleTouchStart = (event: CalendarEvent, e: React.TouchEvent) => {
    e.stopPropagation();
    
    setDraggedEvent(event);
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(new Date());
    
    // Create preview element
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const preview = target.cloneNode(true) as HTMLElement;
    
    preview.style.position = 'absolute';
    preview.style.width = `${rect.width}px`;
    preview.style.height = `${rect.height}px`;
    preview.style.left = `${rect.left}px`;
    preview.style.top = `${rect.top}px`;
    preview.style.opacity = '0.8';
    preview.style.zIndex = '1000';
    preview.style.pointerEvents = 'none';
    preview.classList.add('event-drag-preview');
    
    document.body.appendChild(preview);
    setPreviewElement(preview);
    
    // Wait to determine if this is a drag or just a tap
    setTimeout(() => {
      if (touchStartTime && new Date().getTime() - touchStartTime.getTime() > 150) {
        setIsDragging(true);
        
        // Hide original element
        target.style.opacity = '0.3';
      }
    }, 150);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedEvent || !previewElement) return;
    
    // Prevent scrolling when dragging lessons
    if (isDragging) {
      e.preventDefault();
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY;
      
      // Move the preview element
      previewElement.style.transform = `translateY(${deltaY}px)`;
      
      // Calculate preview position for visual feedback
      const deltaMinutes = Math.round(deltaY / 4); // 4px per minute approximation
      
      // Approximate hour and minute from current position
      const currentTime = new Date(draggedEvent.start);
      const newTime = addMinutes(currentTime, deltaMinutes);
      
      setPreviewPosition({
        hour: newTime.getHours(),
        minute: Math.floor(newTime.getMinutes() / 15) * 15 // Snap to 15 min intervals
      });
    }
    
    // Visual feedback that dragging is happening
    if (Math.abs(e.touches[0].clientY - touchStartY) > 10 && !isDragging) {
      setIsDragging(true);
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleTouchEnd = (hour: number, minute: number) => {
    // Clean up preview element
    if (previewElement) {
      document.body.removeChild(previewElement);
      setPreviewElement(null);
    }
    
    // Restore original element opacity
    document.querySelectorAll('.event-card').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
    
    if (!draggedEvent || !onEventUpdate || !isDragging || !events) {
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
      events,
      draggedEvent.id
    );

    if (hasConflict) {
      toast({
        title: "Ders çakışması",
        description: "Seçilen saatte başka bir ders bulunuyor.",
        variant: "destructive"
      });
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
    setDraggedEvent(null);
    setTouchStartY(0);
    setTouchStartTime(null);
    setIsDragging(false);
    setPreviewPosition(null);
    
    if (previewElement && document.body.contains(previewElement)) {
      document.body.removeChild(previewElement);
    }
    
    setPreviewElement(null);
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
    isDragging,
    previewPosition
  };
};
