
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { useToast } from '@/components/ui/use-toast';
import { differenceInMinutes, addMinutes } from 'date-fns';
import { checkLessonConflict } from '@/utils/lessonConflict';
import { motion, useAnimation } from 'framer-motion';

export const useMobileDragDrop = (
  onEventUpdate?: (event: CalendarEvent) => void
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [touchStartTime, setTouchStartTime] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const { toast } = useToast();

  const handleTouchStart = (event: CalendarEvent, e: React.TouchEvent) => {
    setDraggedEvent(event);
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(new Date());
    
    // Başlangıç pozisyonunu ayarla
    setDragPosition({ x: 0, y: 0 });
    
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
      
      // Dokunmatik hareketi takip et
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;
      
      // Görsel geri bildirim için pozisyonu güncelle
      setDragPosition({ x: 0, y: deltaY });
      
      // Framer Motion animasyonunu güncelle
      controls.start({
        y: deltaY,
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        transition: { type: "spring", damping: 25, stiffness: 300 }
      });
    }
    
    // Visual feedback that dragging is happening
    if (Math.abs(e.touches[0].clientY - touchStartY) > 10) {
      setIsDragging(true);
      document.body.style.cursor = 'grabbing';
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
      // Çakışma durumunda hızlı bir şekilde titreşim animasyonu
      controls.start({
        x: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      }).then(() => {
        controls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring" } });
        
        toast({
          title: "Ders çakışması",
          description: "Seçilen saatte başka bir ders bulunuyor.",
          variant: "destructive"
        });
        resetDrag();
      });
      return;
    }

    // Başarılı taşıma animasyonu
    controls.start({
      y: 0,
      scale: 1,
      opacity: [1, 0.8, 1],
      transition: { type: "spring", damping: 20, stiffness: 300 }
    }).then(() => {
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
    });
  };

  const resetDrag = () => {
    // Animasyonu sıfırla
    controls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring" } });
    
    setDraggedEvent(null);
    setTouchStartY(0);
    setTouchStartTime(null);
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
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
    dragPosition,
    controls
  };
};
