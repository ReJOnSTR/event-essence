import { format } from "date-fns";
import { tr } from 'date-fns/locale';
import { Lesson, Student } from "@/types/calendar";
import { filterLessons } from "./reportCalculations";

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

  const totalHours = filteredLessons.length;
  const totalEarnings = filteredLessons.reduce((total, lesson) => {
    const student = students.find(s => s.id === lesson.studentId);
    return total + (student?.price || 0);
  }, 0);

  return { filteredLessons, totalHours, totalEarnings };
};

export const createTableBody = (
  lessons: Lesson[],
  students: Student[]
) => {
  return lessons.map(lesson => {
    const student = students.find(s => s.id === lesson.studentId);
    return [
      { text: format(new Date(lesson.start), 'd MMMM yyyy', { locale: tr }), style: 'tableCell' },
      { text: `${format(new Date(lesson.start), 'HH:mm')} - ${format(new Date(lesson.end), 'HH:mm')}`, style: 'tableCell' },
      { text: student?.name || "Bilinmeyen Öğrenci", style: 'tableCell' },
      { 
        text: (student?.price || 0).toLocaleString('tr-TR', { 
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