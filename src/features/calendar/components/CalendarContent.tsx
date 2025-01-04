import { CalendarEvent, Student } from "@/types/calendar";
import MonthView from "./MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
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

  const renderView = () => {
    const commonClasses = "rounded-lg border border-border bg-background";
    
    switch (currentView) {
      case "day":
        return <div className={commonClasses}><DayView {...viewProps} /></div>;
      case "week":
        return <div className={commonClasses}><WeekView {...viewProps} /></div>;
      case "year":
        return <div className={commonClasses}><YearView {...viewProps} /></div>;
      default:
        return <div className={commonClasses}><MonthView {...viewProps} /></div>;
    }
  };

  return (
    <div className="w-full h-full">
      {renderView()}
    </div>
  );
}