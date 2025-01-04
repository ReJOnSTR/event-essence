import { Lesson, Period, DateRange } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
} from "date-fns";
import { useMemo } from "react";

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

const getPeriodRange = (period: Period, selectedDate: Date, customRange?: DateRange): DateRange => {
  switch (period) {
    case 'weekly':
      return {
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 })
      };
    case 'monthly':
      return {
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate)
      };
    case 'yearly':
      return {
        start: startOfYear(selectedDate),
        end: endOfYear(selectedDate)
      };
    case 'custom':
      if (!customRange) throw new Error('Custom range required for custom period');
      return customRange;
  }
};

export const useCalculatePeriodHours = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  customRange?: DateRange
): PeriodHours => {
  return useMemo(() => {
    const periods: Period[] = ['weekly', 'monthly', 'yearly'];
    if (customRange) periods.push('custom');

    const result: Partial<PeriodHours> = {};

    periods.forEach(period => {
      const range = getPeriodRange(period, selectedDate, customRange);
      let count = 0;

      lessons.forEach(lesson => {
        const lessonStart = new Date(lesson.start);
        if ((selectedStudent === "all" || lesson.studentId === selectedStudent) &&
            isWithinInterval(lessonStart, range)) {
          count++;
        }
      });

      result[period] = count;
    });

    return result as PeriodHours;
  }, [lessons, selectedDate, selectedStudent, customRange]);
};

export const useCalculatePeriodEarnings = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  students: { id: string; price: number; }[],
  customRange?: DateRange
): PeriodEarnings => {
  return useMemo(() => {
    const periods: Period[] = ['weekly', 'monthly', 'yearly'];
    if (customRange) periods.push('custom');

    const result: Partial<PeriodEarnings> = {};

    periods.forEach(period => {
      const range = getPeriodRange(period, selectedDate, customRange);
      let earnings = 0;

      lessons.forEach(lesson => {
        const lessonStart = new Date(lesson.start);
        if ((selectedStudent === "all" || lesson.studentId === selectedStudent) &&
            isWithinInterval(lessonStart, range)) {
          const student = students.find(s => s.id === lesson.studentId);
          earnings += student?.price || 0;
        }
      });

      result[period] = Math.round(earnings);
    });

    return result as PeriodEarnings;
  }, [lessons, selectedDate, selectedStudent, students, customRange]);
};

export const useFilteredLessons = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  selectedPeriod: Period,
  customRange?: DateRange
): Lesson[] => {
  return useMemo(() => {
    try {
      const range = getPeriodRange(selectedPeriod, selectedDate, customRange);

      return lessons
        .filter(lesson => {
          const lessonStart = lesson.start instanceof Date ? lesson.start : new Date(lesson.start);
          
          return (selectedStudent === "all" || lesson.studentId === selectedStudent) &&
                 isWithinInterval(lessonStart, range);
        })
        .sort((a, b) => {
          const dateA = new Date(a.start);
          const dateB = new Date(b.start);
          return dateA.getTime() - dateB.getTime();
        });
    } catch (error) {
      console.error('Error filtering lessons:', error);
      return [];
    }
  }, [lessons, selectedDate, selectedStudent, selectedPeriod, customRange]);
};