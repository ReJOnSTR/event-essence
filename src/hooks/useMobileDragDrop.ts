
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';

export const useMobileDragDrop = (
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isTouchMoving, setIsTouchMoving] = useState<boolean>(false);

  const handleTouchStart = (event: CalendarEvent, e: React.TouchEvent) => {
    setDraggedEvent(event);
    setTouchStartY(e.touches[0].clientY);
    setIsTouchMoving(false);
    
    // Add visual feedback for touch start
    if (e.currentTarget) {
      e.currentTarget.classList.add('drag-item-dragging');
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedEvent) return;
    e.preventDefault();
    setIsTouchMoving(true);
    
    // You could add code here to visualize where the item would be dropped
    const touchEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    
    // Remove highlight from all potential drop targets
    document.querySelectorAll('.drop-target-active').forEach(el => {
      el.classList.remove('drop-target-active');
    });
    
    // Add highlight to current drop target
    if (touchEl && touchEl.getAttribute('data-droppable-id')) {
      touchEl.classList.add('drop-target-active');
    }
  };

  const handleTouchEnd = (hour: number, minute: number) => {
    if (!draggedEvent || !onEventUpdate) {
      // Clean up any visual effects
      document.querySelectorAll('.drag-item-dragging, .drop-target-active').forEach(el => {
        el.classList.remove('drag-item-dragging', 'drop-target-active');
      });
      setDraggedEvent(null);
      return;
    }

    if (!isTouchMoving) {
      // This was a tap, not a drag, so don't reposition
      document.querySelectorAll('.drag-item-dragging, .drop-target-active').forEach(el => {
        el.classList.remove('drag-item-dragging', 'drop-target-active');
      });
      setDraggedEvent(null);
      return;
    }

    // Add a small delay to improve the visual feedback experience
    setTimeout(() => {
      const newStart = new Date(draggedEvent.start);
      newStart.setHours(hour, minute);
      
      const duration = (new Date(draggedEvent.end).getTime() - new Date(draggedEvent.start).getTime()) / (1000 * 60);
      const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

      onEventUpdate({
        ...draggedEvent,
        start: newStart,
        end: newEnd
      });

      setDraggedEvent(null);
      
      // Clean up any visual effects
      document.querySelectorAll('.drag-item-dragging, .drop-target-active').forEach(el => {
        el.classList.remove('drag-item-dragging', 'drop-target-active');
      });
    }, 150);
  };

  useEffect(() => {
    if (draggedEvent) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [draggedEvent]);

  return {
    draggedEvent,
    handleTouchStart,
    handleTouchEnd
  };
};
