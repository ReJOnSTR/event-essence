import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';

export const useMobileDragDrop = (
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);

  const handleTouchStart = (event: CalendarEvent, e: React.TouchEvent) => {
    setDraggedEvent(event);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!draggedEvent) return;
    e.preventDefault();
  };

  const handleTouchEnd = (hour: number, minute: number) => {
    if (!draggedEvent || !onEventUpdate) return;

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