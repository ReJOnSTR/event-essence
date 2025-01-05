export interface Student {
  id: string;
  name: string;
  color: string;
  price: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  studentId?: string;
  student?: Student;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  lessons: Lesson[];
}

export type CalendarEvent = Lesson;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type Period = 'weekly' | 'monthly' | 'yearly' | 'custom';