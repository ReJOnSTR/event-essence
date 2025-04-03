
import { CalendarEvent, Student } from "@/types/calendar";
import MonthView from "./MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import { ViewType } from "@/store/calendarStore";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Ensure full content visibility by using a larger value for the container height
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="h-full w-full pb-6">
        {currentView === "day" && <DayView {...viewProps} />}
        {currentView === "week" && <WeekView {...viewProps} />}
        {currentView === "month" && <MonthView {...viewProps} />}
        {currentView === "year" && <YearView {...viewProps} />}
      </div>
    </div>
  );
}
