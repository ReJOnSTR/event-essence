import { Lesson } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
} from "date-fns";

export interface PeriodHours {
  weekly: number;
  monthly: number;
  yearly: number;
  custom?: number;
}

export interface PeriodEarnings {
  weekly: number;
  monthly: number;
  yearly: number;
  custom?: number;
}

export const calculatePeriodHours = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  startDate?: Date,
  endDate?: Date
): PeriodHours => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);

  let weeklyHours = 0;
  let monthlyHours = 0;
  let yearlyHours = 0;
  let customHours = 0;

  lessons.forEach((lesson) => {
    const lessonStart = new Date(lesson.start);
    const lessonEnd = new Date(lesson.end);
    const duration = (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60 * 60);

    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyHours += duration;
      }
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyHours += duration;
      }
      if (isWithinInterval(lessonStart, { start: yearStart, end: yearEnd })) {
        yearlyHours += duration;
      }
      if (startDate && endDate && isWithinInterval(lessonStart, { start: startDate, end: endDate })) {
        customHours += duration;
      }
    }
  });

  return {
    weekly: Math.round(weeklyHours),
    monthly: Math.round(monthlyHours),
    yearly: Math.round(yearlyHours),
    ...(startDate && endDate ? { custom: Math.round(customHours) } : {})
  };
};

export const calculatePeriodEarnings = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  students: { id: string; price: number; }[],
  startDate?: Date,
  endDate?: Date
): PeriodEarnings => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);

  let weeklyEarnings = 0;
  let monthlyEarnings = 0;
  let yearlyEarnings = 0;
  let customEarnings = 0;

  lessons.forEach((lesson) => {
    const lessonStart = new Date(lesson.start);
    const lessonEnd = new Date(lesson.end);
    const duration = (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60 * 60);

    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      const student = students.find(s => s.id === lesson.studentId);
      const price = student?.price || 0;
      const earnings = duration * price;

      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyEarnings += earnings;
      }
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyEarnings += earnings;
      }
      if (isWithinInterval(lessonStart, { start: yearStart, end: yearEnd })) {
        yearlyEarnings += earnings;
      }
      if (startDate && endDate && isWithinInterval(lessonStart, { start: startDate, end: endDate })) {
        customEarnings += earnings;
      }
    }
  });

  return {
    weekly: Math.round(weeklyEarnings),
    monthly: Math.round(monthlyEarnings),
    yearly: Math.round(yearlyEarnings),
    ...(startDate && endDate ? { custom: Math.round(customEarnings) } : {})
  };
};

export const getFilteredLessons = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  selectedPeriod: "weekly" | "monthly" | "yearly" | "custom",
  startDate?: Date,
  endDate?: Date
): Lesson[] => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);

  return lessons
    .filter((lesson) => {
      const lessonStart = new Date(lesson.start);
      
      if (selectedStudent !== "all" && lesson.studentId !== selectedStudent) {
        return false;
      }

      switch (selectedPeriod) {
        case "weekly":
          return isWithinInterval(lessonStart, { start: weekStart, end: weekEnd });
        case "monthly":
          return isWithinInterval(lessonStart, { start: monthStart, end: monthEnd });
        case "yearly":
          return isWithinInterval(lessonStart, { start: yearStart, end: yearEnd });
        case "custom":
          return startDate && endDate ? isWithinInterval(lessonStart, { start: startDate, end: endDate }) : false;
        default:
          return false;
      }
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};