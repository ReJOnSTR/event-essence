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

export const useCalculatePeriodHours = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  startDate?: Date,
  endDate?: Date
): PeriodHours => {
  return useMemo(() => {
    const weekly = useFilteredLessons(lessons, selectedDate, selectedStudent, 'weekly').length;
    const monthly = useFilteredLessons(lessons, selectedDate, selectedStudent, 'monthly').length;
    const yearly = useFilteredLessons(lessons, selectedDate, selectedStudent, 'yearly').length;
    const custom = startDate && endDate ? 
      useFilteredLessons(lessons, selectedDate, selectedStudent, 'custom', { start: startDate, end: endDate }).length : 
      undefined;

    return { weekly, monthly, yearly, custom };
  }, [lessons, selectedDate, selectedStudent, startDate, endDate]);
};

export const useCalculatePeriodEarnings = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  students: { id: string; price: number; }[],
  startDate?: Date,
  endDate?: Date
): PeriodEarnings => {
  return useMemo(() => {
    const calculateEarnings = (filteredLessons: Lesson[]) => {
      return filteredLessons.reduce((total, lesson) => {
        const student = students.find(s => s.id === lesson.studentId);
        return total + (student?.price || 0);
      }, 0);
    };

    const weekly = calculateEarnings(useFilteredLessons(lessons, selectedDate, selectedStudent, 'weekly'));
    const monthly = calculateEarnings(useFilteredLessons(lessons, selectedDate, selectedStudent, 'monthly'));
    const yearly = calculateEarnings(useFilteredLessons(lessons, selectedDate, selectedStudent, 'yearly'));
    const custom = startDate && endDate ? 
      calculateEarnings(useFilteredLessons(lessons, selectedDate, selectedStudent, 'custom', { start: startDate, end: endDate })) : 
      undefined;

    return { weekly, monthly, yearly, custom };
  }, [lessons, selectedDate, selectedStudent, students, startDate, endDate]);
};

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