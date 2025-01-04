import { CalendarEvent } from "@/types/calendar";

export const checkLessonConflict = (
  lesson: CalendarEvent,
  existingLessons: CalendarEvent[],
  excludeLessonId?: string
): boolean => {
  const lessonStart = new Date(lesson.start).getTime();
  const lessonEnd = new Date(lesson.end).getTime();

  return existingLessons.some(existingLesson => {
    if (existingLesson.id === excludeLessonId) return false;
    
    const existingStart = new Date(existingLesson.start).getTime();
    const existingEnd = new Date(existingLesson.end).getTime();

    return (
      (lessonStart >= existingStart && lessonStart < existingEnd) ||
      (lessonEnd > existingStart && lessonEnd <= existingEnd) ||
      (lessonStart <= existingStart && lessonEnd >= existingEnd)
    );
  });
};