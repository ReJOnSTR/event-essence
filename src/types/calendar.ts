export interface Student {
  id: string;
  name: string;
  color?: string;
  price: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  studentId?: string;
  recurrenceType?: "none" | "daily" | "weekly" | "monthly";
  recurrenceCount?: number;
  recurrenceInterval?: number;
  parentLessonId?: string;
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

export interface WorkingHours {
  start: string;
  end: string;
  enabled: boolean;
}

export interface WeeklyWorkingHours {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday: WorkingHours;
  sunday: WorkingHours;
}