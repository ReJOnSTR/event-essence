import { CalendarEvent, Student } from "@/types/calendar";
import MonthView from "./MonthView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import YearView from "./YearView";
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