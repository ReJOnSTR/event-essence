import { Lesson, Period, DateRange, Student } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
  differenceInHours,
  differenceInMinutes
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
      if (!customRange?.start || !customRange?.end) {
        return {
          start: selectedDate,
          end: selectedDate
        };
      }
      return customRange;
  }
};

const calculateLessonDuration = (start: Date, end: Date): number => {
  const diffMinutes = differenceInMinutes(end, start);
  return diffMinutes / 60;
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
      return (selectedStudent === "all" || lesson.studentId === selectedStudent) &&
             isWithinInterval(lessonStart, { start: range.start, end: range.end });
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
      let totalHours = 0;
      let totalEarnings = 0;

      filteredLessons.forEach(lesson => {
        const lessonStart = new Date(lesson.start);
        const lessonEnd = new Date(lesson.end);
        const duration = calculateLessonDuration(lessonStart, lessonEnd);
        
        const student = students.find(s => s.id === lesson.studentId);
        if (student) {
          totalHours += duration;
          totalEarnings += student.price;
        }
      });

      return {
        hours: totalHours,
        earnings: totalEarnings
      };
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
        weekly: Number(weekly.hours.toFixed(1)),
        monthly: Number(monthly.hours.toFixed(1)),
        yearly: Number(yearly.hours.toFixed(1)),
        custom: Number(custom.hours.toFixed(1))
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