import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, isToday } from "date-fns";
import { tr } from 'date-fns/locale';
import ViewSelector from "./ViewSelector";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { isHoliday } from "@/utils/turkishHolidays";
import { useUserSettings } from "@/hooks/useUserSettings";
import DayStatusIcons from "./DayStatusIcons";

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
  const isMobile = useIsMobile();
  const { settings } = useUserSettings();
  const customHolidays = settings?.holidays || [];
  const allowWorkOnHolidays = settings?.allow_work_on_holidays ?? true;
  const workingHours = settings?.working_hours;
  
  const getDateFormat = () => {
    if (isMobile) {
      switch (currentView) {
        case 'day':
          return "d MMM EEE";
        case 'week':
          return "MMM yyyy";
        case 'month':
          return "MMM yyyy";
        case 'year':
          return "yyyy";
        default:
          return "MMM yyyy";
      }
    }

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

  const holiday = isHoliday(date, customHolidays);
  const dayOfWeek = format(date, 'EEEE').toLowerCase();
  const daySettings = workingHours?.[dayOfWeek as keyof typeof workingHours];

  return (
    <div className="p-2 md:p-4 border-b bg-background sticky top-0 z-10">
      <ViewSelector
        currentView={currentView}
        onViewChange={onViewChange}
      />
      
      <div className="flex justify-between items-center mt-2 md:mt-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <h1 className={cn(
              "text-lg md:text-2xl font-semibold truncate text-foreground",
              currentView === 'day' && isToday(date) ? "text-calendar-blue" : ""
            )}>
              {format(date, getDateFormat(), { locale: tr })}
            </h1>
            {currentView === 'day' && (
              <DayStatusIcons 
                isHoliday={holiday && !allowWorkOnHolidays}
                isWorkingHoliday={holiday && allowWorkOnHolidays}
                isNonWorkingDay={!daySettings?.enabled}
                holidayName={holiday?.name}
                className="static flex gap-1"
              />
            )}
          </div>
        </div>
        <div className="flex gap-1 md:gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "icon"} 
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={onToday}
            className="flex gap-1 md:gap-2 items-center whitespace-nowrap"
          >
            <CalendarDays className="h-4 w-4" />
            {!isMobile && "Bugün"}
          </Button>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "icon"} 
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}