import { Lesson } from "@/types/calendar";
import { isWithinInterval } from "date-fns";

export const getFilteredLessons = (
  lessons: Lesson[],
  startDate: Date,
  endDate: Date,
  selectedStudent: string
): Lesson[] => {
  return lessons
    .filter((lesson) => {
      const lessonStart = new Date(lesson.start);
      
      // Öğrenci filtresi
      if (selectedStudent !== "all" && lesson.studentId !== selectedStudent) {
        return false;
      }

      // Tarih aralığı filtresi
      return isWithinInterval(lessonStart, { start: startDate, end: endDate });
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};

export const calculateTotalHours = (
  lessons: Lesson[],
  startDate: Date,
  endDate: Date,
  selectedStudent: string
): number => {
  const filteredLessons = getFilteredLessons(lessons, startDate, endDate, selectedStudent);
  
  return filteredLessons.reduce((total, lesson) => {
    const start = new Date(lesson.start);
    const end = new Date(lesson.end);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + duration;
  }, 0);
};