import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Lesson, Student } from "@/types/calendar";
import { filterLessons } from "./reportCalculations";
import { differenceInHours } from "date-fns";

export const calculatePdfStats = (
  lessons: Lesson[],
  students: Student[],
  selectedDate: Date,
  selectedStudent: string,
  selectedPeriod: string,
  startDate?: Date,
  endDate?: Date
) => {
  const filteredLessons = filterLessons(
    lessons,
    selectedDate,
    selectedStudent,
    selectedPeriod as any,
    startDate && endDate ? { start: startDate, end: endDate } : undefined
  );

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

  return { filteredLessons, totalHours, totalEarnings };
};

export const createTableBody = (
  lessons: Lesson[],
  students: Student[]
) => {
  return lessons.map(lesson => {
    const start = new Date(lesson.start);
    const end = new Date(lesson.end);
    const student = students.find(s => s.id === lesson.studentId);
    const hours = differenceInHours(end, start);
    const earnings = (student?.price || 0) * hours;
    
    return [
      { text: format(start, 'd MMMM yyyy', { locale: tr }), style: 'tableCell' },
      { text: `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`, style: 'tableCell' },
      { text: student?.name || "Bilinmeyen Öğrenci", style: 'tableCell' },
      { 
        text: earnings.toLocaleString('tr-TR', { 
          style: 'currency', 
          currency: 'TRY',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }), 
        style: 'tableCell' 
      }
    ];
  });
};