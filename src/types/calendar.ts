export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  studentId?: string;
}

export type CalendarEvent = Lesson;