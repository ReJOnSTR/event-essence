import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import ViewSelector from "./ViewSelector";
import { cn } from "@/lib/utils";

interface CalendarPageHeaderProps {
  date: Date;
  currentView: string;
  onViewChange: (view: string) => void;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onToday: (e: React.MouseEvent) => void;
}

export default function CalendarPageHeader({
  date,
  currentView,
  onViewChange,
  onPrevious,
  onNext,
  onToday
}: CalendarPageHeaderProps) {
  const getDateFormat = () => {
    switch (currentView) {
      case 'day':
        return "d MMMM yyyy, EEEE";
      case 'week':
        return "MMMM yyyy";
      case 'month':
        return "MMMM yyyy";
      case 'year':
        return "yyyy";
      default:
        return "MMMM yyyy";
    }
  };

  const handleViewChange = (view: string) => {
    localStorage.setItem('calendarView', view);
    onViewChange(view);
  };

  return (
    <div className="p-4 border-b bg-white sticky top-0 z-10">
      <ViewSelector
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-4">
          <h1 className={cn(
            "text-2xl font-semibold",
            currentView === 'day' && isToday(date) ? "text-calendar-blue" : "text-gray-900"
          )}>
            {format(date, getDateFormat(), { locale: tr })}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={onToday}
            className="flex gap-2 items-center"
          >
            <CalendarDays className="h-4 w-4" />
            Bugün
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}