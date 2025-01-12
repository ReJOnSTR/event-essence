import { memo } from "react";
import { CalendarEvent, Student } from "@/types/calendar";
import { ViewType } from "@/store/calendarStore";
import { CalendarLoading } from "./CalendarLoading";
import MonthView from "./MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";

interface CalendarContentProps {
  currentView: ViewType;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  students: Student[];
  isLoading?: boolean;
}

const CalendarContent = memo(({
  currentView,
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
  onEventUpdate,
  students,
  isLoading
}: CalendarContentProps) => {
  const viewProps = {
    date: selectedDate,
    events,
    onDateSelect,
    onEventClick,
    onEventUpdate,
    students,
  };

  return (
    <div className="relative">
      {isLoading && <CalendarLoading />}
      <div className="p-2 md:p-4">
        {(() => {
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
        })()}
      </div>
    </div>
  );
});

CalendarContent.displayName = "CalendarContent";

export default CalendarContent;