import { Lesson } from "@/types/calendar";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  isWithinInterval,
  isSameMonth,
  isSameYear
} from "date-fns";

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
  // Seçilen tarihe göre periyot başlangıç ve bitiş tarihlerini belirle
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);

  let weeklyHours = 0;
  let monthlyHours = 0;
  let yearlyHours = 0;

  // Her ders için kontrol et
  lessons.forEach((lesson) => {
    const lessonStart = new Date(lesson.start);
    const lessonEnd = new Date(lesson.end);
    
    // Ders süresini saat cinsinden hesapla
    const duration = (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60 * 60);

    // Seçilen öğrenciye ait veya tüm öğrenciler seçili ise
    if (selectedStudent === "all" || lesson.studentId === selectedStudent) {
      // Haftalık hesaplama - seçili haftadaki dersler
      if (isWithinInterval(lessonStart, { start: weekStart, end: weekEnd })) {
        weeklyHours += duration;
      }

      // Aylık hesaplama - seçili aydaki dersler
      if (isWithinInterval(lessonStart, { start: monthStart, end: monthEnd })) {
        monthlyHours += duration;
      }

      // Yıllık hesaplama - seçili yıldaki dersler
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

export const getFilteredLessons = (
  lessons: Lesson[],
  selectedDate: Date,
  selectedStudent: string,
  selectedPeriod: "weekly" | "monthly" | "yearly"
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
      
      // Öğrenci filtresi
      if (selectedStudent !== "all" && lesson.studentId !== selectedStudent) {
        return false;
      }

      // Periyot filtresi
      switch (selectedPeriod) {
        case "weekly":
          return isWithinInterval(lessonStart, { start: weekStart, end: weekEnd });
        case "monthly":
          return isWithinInterval(lessonStart, { start: monthStart, end: monthEnd });
        case "yearly":
          return isWithinInterval(lessonStart, { start: yearStart, end: yearEnd });
        default:
          return false;
      }
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};