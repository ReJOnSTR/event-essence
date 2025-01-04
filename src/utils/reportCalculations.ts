import { Lesson, Period, DateRange, Student } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
  parseISO,
  endOfDay,
  startOfDay,
  differenceInHours
} from "date-fns";
import { useMemo } from "react";

export interface PeriodHours {
  weekly: number;
  monthly: number;
  yearly: number;
  custom: number;
}

export interface PeriodEarnings {
  weekly: number;
  monthly: number;
  yearly: number;
  custom: number;
}

const getPeriodRange = (period: Period, selectedDate: Date, customRange?: DateRange): DateRange => {
  switch (period) {
    case 'weekly':
      return {
        start: startOfDay(startOfWeek(selectedDate, { weekStartsOn: 1 })),
        end: endOfDay(endOfWeek(selectedDate, { weekStartsOn: 1 }))
      };
    case 'monthly':
      return {
        start: startOfDay(startOfMonth(selectedDate)),
        end: endOfDay(endOfMonth(selectedDate))
      };
    case 'yearly':
      return {
        start: startOfDay(startOfYear(selectedDate)),
        end: endOfDay(endOfYear(selectedDate))
      };
    case 'custom':
      if (!customRange?.start || !customRange?.end) {
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        };
      }
      return {
        start: startOfDay(customRange.start),
        end: endOfDay(customRange.end)
      };
  }
};

export const filterLessons = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  period: Period,
  customRange?: DateRange
): Lesson[] => {
  const range = getPeriodRange(period, selectedDate, customRange);

  return lessons
    .filter(lesson => {
      const lessonStart = new Date(lesson.start);
      const lessonEnd = new Date(lesson.end);
      
      return (
        (selectedStudent === "all" || lesson.studentId === selectedStudent) &&
        isWithinInterval(lessonStart, { 
          start: range.start, 
          end: range.end 
        })
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });
};

export const useFilteredLessons = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  period: Period,
  customRange?: DateRange
): Lesson[] => {
  return useMemo(
    () => filterLessons(lessons, selectedDate, selectedStudent, period, customRange),
    [lessons, selectedDate, selectedStudent, period, customRange]
  );
};

export const useCalculatePeriodStats = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  students: Student[],
  startDate?: Date,
  endDate?: Date
): { hours: PeriodHours; earnings: PeriodEarnings } => {
  return useMemo(() => {
    const calculateStats = (filteredLessons: Lesson[]) => {
      const totalHours = filteredLessons.reduce((total, lesson) => {
        const start = new Date(lesson.start);
        const end = new Date(lesson.end);
        return total + differenceInHours(end, start);
      }, 0);

      const totalEarnings = filteredLessons.reduce((total, lesson) => {
        const student = students.find(s => s.id === lesson.studentId);
        const hours = differenceInHours(new Date(lesson.end), new Date(lesson.start));
        return total + (student?.price || 0) * hours;
      }, 0);

      return { hours: totalHours, earnings: totalEarnings };
    };

    const weeklyLessons = filterLessons(lessons, selectedDate, selectedStudent, 'weekly');
    const monthlyLessons = filterLessons(lessons, selectedDate, selectedStudent, 'monthly');
    const yearlyLessons = filterLessons(lessons, selectedDate, selectedStudent, 'yearly');
    const customLessons = filterLessons(
      lessons,
      selectedDate,
      selectedStudent,
      'custom',
      startDate && endDate ? { start: startDate, end: endDate } : undefined
    );

    const weekly = calculateStats(weeklyLessons);
    const monthly = calculateStats(monthlyLessons);
    const yearly = calculateStats(yearlyLessons);
    const custom = calculateStats(customLessons);

    return {
      hours: {
        weekly: weekly.hours,
        monthly: monthly.hours,
        yearly: yearly.hours,
        custom: custom.hours
      },
      earnings: {
        weekly: weekly.earnings,
        monthly: monthly.earnings,
        yearly: yearly.earnings,
        custom: custom.earnings
      }
    };
  }, [lessons, selectedDate, selectedStudent, students, startDate, endDate]);
};