
import { CalendarEvent, Student } from "@/types/calendar";
import MonthView from "./MonthView";
import DayView from "@/components/Calendar/DayView";
import WeekView from "@/components/Calendar/WeekView";
import YearView from "@/components/Calendar/YearView";
import { ViewType } from "@/store/calendarStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

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

  const renderCalendarView = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
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
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="pb-20">
        {renderCalendarView()}
      </div>
    </ScrollArea>
  );
}
