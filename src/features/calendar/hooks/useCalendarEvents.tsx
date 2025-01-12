import { useEffect } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { useLessons } from '@/hooks/useLessons';
import { useStudents } from '@/hooks/useStudents';
import { CalendarEvent } from '@/types/calendar';

export const useCalendarEvents = () => {
  const { setIsLoading } = useCalendarStore();
  const { lessons, saveLesson, deleteLesson, isLoading: lessonsLoading } = useLessons();
  const { students } = useStudents();

  useEffect(() => {
    setIsLoading(lessonsLoading);
  }, [lessonsLoading, setIsLoading]);

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    saveLesson(updatedEvent);
  };

  const handleEventDelete = (lessonId: string) => {
    deleteLesson(lessonId);
  };

  return {
    events: lessons,
    students,
    isLoading: lessonsLoading,
    handleEventUpdate,
    handleEventDelete
  };
};