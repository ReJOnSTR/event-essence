export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
}

export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}