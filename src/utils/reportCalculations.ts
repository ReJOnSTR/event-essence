import { Lesson } from "@/types/calendar";
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from "date-fns";

export interface PeriodHours {
  weekly: number;
  monthly: number;
  yearly: number;
}

export const calculatePeriodHours = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string
): PeriodHours => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(selectedDate);
  const yearStart = startOfYear(selectedDate);
  
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const monthEnd = endOfMonth(selectedDate);
  const yearEnd = endOfYear(selectedDate);

  let weeklyHours = 0;
  let monthlyHours = 0;
  let yearlyHours = 0;

  lessons.forEach((lesson) => {
    const lessonStart = new Date(lesson.start);
    const lessonEnd = new Date(lesson.end);
    const duration = (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60 * 60);

    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      // Weekly calculation
      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyHours += duration;
      }
      // Monthly calculation
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyHours += duration;
      }
      // Yearly calculation
      if (isWithinInterval(lessonStart, { start: yearStart, end: yearEnd })) {
        yearlyHours += duration;
      }
    }
  });

  return {
    weekly: Math.round(weeklyHours),
    monthly: Math.round(monthlyHours),
    yearly: Math.round(yearlyHours)
  };
};