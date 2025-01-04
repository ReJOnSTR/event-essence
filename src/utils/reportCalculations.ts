import { Lesson } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
  parseISO,
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

  let weeklyCount = 0;
  let monthlyCount = 0;
  let yearlyCount = 0;
  let customCount = 0;

  lessons.forEach((lesson) => {
    const lessonStart = new Date(lesson.start);

    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyCount++;
      }
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyCount++;
      }
      if (isWithinInterval(lessonStart, { start: yearStart, end: yearEnd })) {
        yearlyCount++;
      }
      if (startDate && endDate && isWithinInterval(lessonStart, { start: startDate, end: endDate })) {
        customCount++;
      }
    }
  });

  return {
    weekly: weeklyCount,
    monthly: monthlyCount,
    yearly: yearlyCount,
    ...(startDate && endDate ? { custom: customCount } : {})
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
    
    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      const student = students.find(s => s.id === lesson.studentId);
      const price = student?.price || 0;

      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyEarnings += price;
      }
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyEarnings += price;
      }
      if (isWithinInterval(lessonStart, { start: yearStart, end: yearEnd })) {
        yearlyEarnings += price;
      }
      if (startDate && endDate && isWithinInterval(lessonStart, { start: startDate, end: endDate })) {
        customEarnings += price;
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
      // Tarihi string ise Date objesine çevir
      const lessonStart = lesson.start instanceof Date ? lesson.start : new Date(lesson.start);
      
      // Öğrenci filtresi
      if (selectedStudent !== "all" && lesson.studentId !== selectedStudent) {
        return false;
      }

      // Tarih aralığı filtresi
      let periodStart: Date;
      let periodEnd: Date;

      switch (selectedPeriod) {
        case "weekly":
          periodStart = weekStart;
          periodEnd = weekEnd;
          break;
        case "monthly":
          periodStart = monthStart;
          periodEnd = monthEnd;
          break;
        case "yearly":
          periodStart = yearStart;
          periodEnd = yearEnd;
          break;
        case "custom":
          if (!startDate || !endDate) return false;
          periodStart = startDate;
          periodEnd = endDate;
          break;
        default:
          return false;
      }

      return isWithinInterval(lessonStart, { 
        start: periodStart, 
        end: periodEnd 
      });
    })
    .sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });
};