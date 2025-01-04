import { format, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/store/calendarStore";
import ViewSelector from "./ViewSelector";
import { cn } from "@/lib/utils";

interface CalendarPageHeaderProps {
  date: Date;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarPageHeader = ({
  date,
  currentView,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-2 md:p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className={cn(
          "text-lg font-medium",
          isToday(date) && "text-calendar-blue"
        )}>
          {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="h-8"
        >
          Bugün
        </Button>
        <ViewSelector currentView={currentView} onViewChange={onViewChange} />
      </div>
    </div>
  );
};

export default CalendarPageHeader;