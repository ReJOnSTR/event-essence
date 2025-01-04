import { CalendarEvent } from "@/types/calendar";
import { areIntervalsOverlapping } from "date-fns";

export const checkLessonConflict = (
  newLesson: { start: Date; end: Date },
  existingLessons: CalendarEvent[],
  excludeLessonId?: string
): boolean => {
  return existingLessons.some(lesson => {
    if (lesson.id === excludeLessonId) return false;
    
    return areIntervalsOverlapping(
      { start: new Date(lesson.start), end: new Date(lesson.end) },
      { start: new Date(newLesson.start), end: new Date(newLesson.end) }
    );
  });
};