
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

  // Calculate appropriate height based on view type to ensure full content is visible
  const getViewHeight = () => {
    switch(currentView) {
      case "day":
        return "h-[calc(100vh-180px)]";
      case "week":
        return "h-[calc(100vh-180px)]";
      case "month":
        return "h-[calc(100vh-180px)]";
      case "year":
        return "h-[calc(100vh-180px)]";
      default:
        return "h-full";
    }
  };

  return (
    <ScrollArea className={`${getViewHeight()} overflow-y-auto`}>
      <div className="pb-6 w-full">
        {currentView === "day" && <DayView {...viewProps} />}
        {currentView === "week" && <WeekView {...viewProps} />}
        {currentView === "month" && <MonthView {...viewProps} />}
        {currentView === "year" && <YearView {...viewProps} />}
      </div>
    </ScrollArea>
  );
}
