import { CalendarEvent, Student } from "@/types/calendar";
import DayView from "./day-view";
import WeekView from "./week-view";
import MonthView from "./month-view";
import YearView from "./year-view";
import { ViewType } from "@/store/calendarStore";

interface CalendarContentProps {
  currentView: ViewType;
  selectedDate: Date;
  lessons: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  students: Student[];
}

export default function CalendarContent({
  currentView,
  selectedDate,
  lessons,
  onDateSelect,
  onEventClick,
  onEventUpdate,
  students
}: CalendarContentProps) {
  const viewProps = {
    date: selectedDate,
    events: lessons,
    onDateSelect,
    onEventClick,
    onEventUpdate,
    students,
  };

  switch (currentView) {
    case "day":
      return <DayView {...viewProps} />;
    case "week":
      return <WeekView {...viewProps} />;
    case "year":
      return <YearView {...viewProps} />;
    default:
      return <MonthView {...viewProps} />;
  }
}