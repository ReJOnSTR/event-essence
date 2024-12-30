export interface Lesson {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  studentId?: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  lessons: Lesson[];
}

// Alias for backward compatibility during refactoring
export type CalendarEvent = Lesson;