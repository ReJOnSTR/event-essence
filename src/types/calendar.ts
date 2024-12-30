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